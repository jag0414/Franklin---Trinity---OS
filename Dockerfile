# Trinity AI API container
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System deps (Removed heavy OCR/Image libs to fix OOM build errors)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# uploads folder will be mounted as a volume in compose
RUN mkdir -p /app/uploads

# Railway/Heroku provide the PORT env var
ENV PORT=8080
EXPOSE $PORT

CMD ["sh", "-c", "python -m uvicorn app:app --host 0.0.0.0 --port ${PORT}"]
