FROM python:3.12-slim

WORKDIR /backend

COPY requirements.txt .
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    python3-dev && \
    rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD alembic upgrade head \
    && uvicorn backend.main:app --host 0.0.0.0 --port 8000