# Franklin OS • BidNova • Trinity
# Unified Resurrection Build

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from sqlmodel import SQLModel, Field, Session, create_engine, select
from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt, json, uuid

# ---------------- CONFIG ----------------
APP_NAME = "Franklin OS • BidNova • Trinity"
SECRET = "CHANGE_ME_NOW"
JWT_ALGO = "HS256"
DB_URL = "sqlite:///franklin.db"

engine = create_engine(DB_URL, connect_args={"check_same_thread": False})
app = FastAPI(title=APP_NAME)

# ---------------- MODELS ----------------
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    role: str  # client | contractor | admin
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BidRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    client_id: int
    title: str
    description: str
    open: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Bid(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    request_id: int
    contractor_id: int
    price: float
    message: Optional[str] = None
    accepted: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Contract(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    bid_id: int
    contract_uuid: str
    status: str = "draft"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Audit(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    event: str
    payload: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

SQLModel.metadata.create_all(engine)

# ---------------- HELPERS ----------------
def audit(event: str, payload: dict):
    with Session(engine) as s:
        s.add(Audit(event=event, payload=json.dumps(payload)))
        s.commit()

def create_token(user: User):
    return jwt.encode(
        {
            "sub": user.id,
            "role": user.role,
            "exp": datetime.now(timezone.utc) + timedelta(days=30)
        },
        SECRET,
        algorithm=JWT_ALGO
    )

def get_user(req: Request) -> User:
    token = req.query_params.get("token")
    if not token:
        raise HTTPException(401, "Token required")
    try:
        data = jwt.decode(token, SECRET, algorithms=[JWT_ALGO])
    except Exception:
        raise HTTPException(401, "Invalid token")
    with Session(engine) as s:
        user = s.get(User, data["sub"])
        if not user:
            raise HTTPException(401, "User not found")
        return user

# ---------------- FRONTEND ----------------
@app.get("/", response_class=HTMLResponse)
def home():
    return """
    <html>
    <head><title>Franklin OS</title></head>
    <body style="font-family:system-ui;background:#0f172a;color:#e5e7eb;padding:40px">
        <h1>Franklin OS • BidNova • Trinity</h1>
        <p>The system is alive again.</p>
        <ul>
            <li>/auth/register</li>
            <li>/requests</li>
            <li>/bids</li>
            <li>/contracts</li>
            <li>/admin/audit</li>
            <li>/health</li>
        </ul>
    </body>
    </html>
    """

# ---------------- AUTH ----------------
@app.post("/auth/register")
def register(email: str, role: str):
    with Session(engine) as s:
        user = s.exec(select(User).where(User.email == email)).first()
        if not user:
            user = User(email=email, role=role)
            s.add(user)
            s.commit()
            s.refresh(user)
            audit("user.register", {"email": email, "role": role})
        return {"token": create_token(user), "user_id": user.id}

# ---------------- BID REQUESTS ----------------
@app.post("/requests")
def create_request(title: str, description: str, req: Request):
    user = get_user(req)
    if user.role != "client":
        raise HTTPException(403, "Only clients can create requests")
    with Session(engine) as s:
        br = BidRequest(client_id=user.id, title=title, description=description)
        s.add(br)
        s.commit()
        s.refresh(br)
        audit("request.create", {"request_id": br.id})
        return br

@app.get("/requests")
def list_requests():
    with Session(engine) as s:
        return s.exec(select(BidRequest).where(BidRequest.open == True)).all()

# ---------------- BIDS ----------------
@app.post("/bids")
def submit_bid(request_id: int, price: float, message: str, req: Request):
    user = get_user(req)
    if user.role != "contractor":
        raise HTTPException(403, "Only contractors can bid")
    with Session(engine) as s:
        req_obj = s.get(BidRequest, request_id)
        if not req_obj or not req_obj.open:
            raise HTTPException(404, "Request closed or missing")
        bid = Bid(
            request_id=request_id,
            contractor_id=user.id,
            price=price,
            message=message
        )
        s.add(bid)
        s.commit()
        s.refresh(bid)
        audit("bid.submit", {"bid_id": bid.id})
        return bid

# ---------------- CONTRACTS ----------------
@app.post("/bids/{bid_id}/accept")
def accept_bid(bid_id: int, req: Request):
    user = get_user(req)
    with Session(engine) as s:
        bid = s.get(Bid, bid_id)
        if not bid:
            raise HTTPException(404, "Bid not found")
        br = s.get(BidRequest, bid.request_id)
        if br.client_id != user.id:
            raise HTTPException(403, "Not your request")
        bid.accepted = True
        br.open = False
        contract = Contract(
            bid_id=bid.id,
            contract_uuid=str(uuid.uuid4())
        )
        s.add(bid)
        s.add(br)
        s.add(contract)
        s.commit()
        s.refresh(contract)
        audit("contract.create", {"contract_uuid": contract.contract_uuid})
        return contract

# ---------------- ADMIN ----------------
@app.get("/admin/audit")
def read_audit():
    with Session(engine) as s:
        return s.exec(select(Audit).order_by(Audit.created_at.desc())).all()

# ---------------- HEALTH ----------------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "system": APP_NAME,
        "time": datetime.now(timezone.utc).isoformat()
    }
