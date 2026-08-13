# ─── Builder stage ───────────────────────────────────────────────────
FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /build

# System deps needed to build psycopg2-binary and friends
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user -r requirements.txt

# ─── Runtime stage ──────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH=/home/fff/.local/bin:$PATH \
    PYTHONPATH=/app

# Runtime-only system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r fff && useradd -r -g fff -m -d /home/fff fff

# Copy installed Python packages from builder
COPY --from=builder /root/.local /home/fff/.local

WORKDIR /app

# Pre-create directories used at runtime
RUN mkdir -p /app/uploads /app/logs && chown -R fff:fff /app

USER fff

# Healthcheck used by docker compose
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fsS http://localhost:8000/health || exit 1

EXPOSE 8000

# Default command: uvicorn. Override in compose for worker / migrations / seed.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
