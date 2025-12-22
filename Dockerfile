# Trinity AI API container
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System deps for OCR and image libs
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       tesseract-ocr libgl1 libglib2.0-0 curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY app.py ./
COPY trinity_orchestrator_unified.py ./
COPY trinity_mothership.py ./
COPY telemetry.py ./
COPY config.py ./
COPY index.html ./
COPY middleware ./middleware
COPY routers ./routers
COPY tests ./tests

# uploads folder will be mounted as a volume in compose
RUN mkdir -p /app/uploads

# Railway/Heroku provide the PORT env var
ENV PORT=8000
EXPOSE $PORT

CMD ["sh", "-c", "python -m uvicorn app:app --host 0.0.0.0 --port ${PORT}"]
