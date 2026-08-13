# SETUP.md — Local Development

> **Get the platform running on a fresh machine in under 15 minutes.** Works on Windows (PowerShell 5.1), macOS, and Linux.

---

## 1. Prerequisites

| Tool | Version | Why |
|---|---|---|
| **Docker** | 24.x or newer | All services run in containers |
| **Docker Compose** | v2 (`docker compose …`) | One-command stack |
| **Git** | 2.x | Code |
| **Make** *(optional)* | any | Convenience targets |

If you don't have Docker installed: <https://docs.docker.com/get-docker/>.

You do **not** need Python, Postgres, or Redis installed locally — they all run in containers.

You **do** need an LLM API key for the LLM layer. Ask Victor for one or set up your own at <https://console.anthropic.com>.

---

## 2. Clone

```bash
git clone <repo-url> arbarne
cd arbarne
```

---

## 3. Environment

Copy the example env file and fill in your local values:

```bash
cp .env.example .env
# then edit .env
```

Most keys have sensible defaults; the only ones you usually need to set:

```dotenv
# Postgres
POSTGRES_USER=fff
POSTGRES_PASSWORD=fff_dev
POSTGRES_DB=fff

# LLM
ANTHROPIC_API_KEY=sk-ant-…

# Redis
REDIS_URL=redis://redis:6379/0
```

---

## 4. Bring up the stack

```bash
docker compose up --build
```

You should see:

- `postgres` ready (port 5432)
- `redis` ready (port 6379)
- `backend` (FastAPI) ready (port 8000)
- `worker` (Celery) ready
- `frontend` ready (port 8080)

To run in the background:

```bash
docker compose up -d
docker compose logs -f backend
```

---

## 5. First-run migrations

The first time you bring the stack up, seed the framework content:

```bash
docker compose exec backend alembic upgrade head
docker compose exec backend python -m app.scripts.seed_framework
```

You should see output confirming 8 pillars, 40 capabilities, and 200 questions seeded.

Verify:

```bash
docker compose exec postgres psql -U fff -d fff -c "SELECT COUNT(*) FROM questions;"
# expected: 200
```

---

## 6. Smoke test

```bash
# Backend health
curl http://localhost:8000/health

# List pillars (should return 8)
curl http://localhost:8000/api/pillars

# Open the frontend
open http://localhost:8080   # macOS
xdg-open http://localhost:8080   # Linux
start http://localhost:8080   # Windows
```

You should see the FFF self-assessment start screen.

---

## 7. Offline behavior

The frontend is a service-worker–backed PWA. To smoke-test offline:

1. Open `http://localhost:8080`
2. Start a self-assessment
3. In Chrome DevTools → Application → Service Workers, tick "Offline"
4. Continue answering — answers persist locally
5. Untick "Offline" — answers sync to the backend

---

## 8. Running tests

### Docker Execution
```bash
# Backend unit tests
docker compose exec backend pytest

# Scoring engine tests specifically
docker compose exec backend pytest tests/test_scoring.py -v
```

### Local Virtual Environment Execution (Windows / PowerShell)
```powershell
# Navigate to backend directory
cd src\backend

# Run pytest using local virtualenv
& .venv\Scripts\pytest.exe -v
```

At minimum, the scoring-engine tests must pass:

```bash
docker compose exec backend pytest tests/test_scoring.py -v
```

These verify that the same answers always produce the same score, and that the score is traceable to specific answers + rule version. All 33 unit and integration tests are verified green.

---

## 9. Common operations

### Stop the stack

```bash
docker compose down
```

### Wipe and re-seed (dev only)

```bash
docker compose down -v
docker compose up --build
docker compose exec backend alembic upgrade head
docker compose exec backend python -m app.scripts.seed_framework
```

### Tail logs

```bash
docker compose logs -f backend
docker compose logs -f worker
```

### Open a shell in a service

```bash
docker compose exec backend bash
docker compose exec postgres psql -U fff -d fff
```

### Re-run a single Celery task

```bash
docker compose exec worker celery -A app.worker call app.tasks.run_segmentation
```

---

## 10. Project layout (when code is added)

```
arbarne/
├── CLAUDE.md
├── PLANNING.md
├── TASKS.md
├── docs/
│   ├── prd/
│   │   ├── prd-refined.md
│   │   └── prd-4.md
│   ├── DECISIONS.md
│   ├── DATA_MODEL.md
│   ├── GLOSSARY.md
│   ├── SETUP.md            ← this file
│   └── SOURCE_INDEX.md
├── src/
│   ├── backend/            ← FastAPI app
│   │   ├── app/
│   │   │   ├── api/        ← FastAPI routers
│   │   │   ├── scoring/    ← scoring engine (no LLM dep)
│   │   │   ├── recommendations/
│   │   │   ├── llm/        ← Claude integration
│   │   │   ├── ml/         ← batch ML jobs
│   │   │   ├── models/     ← SQLAlchemy models
│   │   │   ├── schemas/    ← Pydantic schemas
│   │   │   └── scripts/    ← seed_framework, etc.
│   │   ├── tests/
│   │   ├── alembic/
│   │   ├── Dockerfile
│   │   └── pyproject.toml
│   ├── frontend/
│   │   ├── public/
│   │   ├── src/
│   │   ├── service-worker.js
│   │   ├── Dockerfile
│   │   └── package.json
│   └── worker/             ← Celery worker entry point
├── deploy/
│   └── docker-compose.yml
└── .env.example
```

The frontend directory is created in Week 2. The worker entry is created in Week 3.

---

## 11. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `docker compose up` says port 5432 already in use | Local Postgres running | Stop local Postgres, or change `POSTGRES_PORT` in `.env` |
| Backend logs `connection refused` to postgres | Postgres not yet ready | Wait 5–10 seconds; compose has a healthcheck but cold starts can lag |
| `alembic upgrade head` fails | Migrations missing | Run `docker compose exec backend alembic revision --autogenerate` after a model change; commit the generated file |
| Frontend loads but `/api/pillars` 404s | Backend not running, or wrong port | Check `docker compose ps` and `docker compose logs backend` |
| LLM call fails | Missing or invalid `ANTHROPIC_API_KEY` | Set in `.env`, `docker compose restart backend` |
| Tests flaky | Test data not isolated | Each test should create its own `assessment` row with a UUID |

---

## 12. PR checklist

Before opening a PR:

- [ ] Local stack runs (`docker compose up`)
- [ ] Seeded data is intact (`SELECT COUNT(*) FROM questions;` returns 200)
- [ ] Tests pass (`docker compose exec backend pytest`)
- [ ] No `print()` debug statements left in production code
- [ ] All env vars added to `.env.example` with sane defaults
- [ ] PR description cites the PRD section it implements

---

## 13. Where to get help

- Slack `#future-farms-framework` — most questions
- `docs/DECISIONS.md` — what's been decided and why
- `docs/GLOSSARY.md` — terminology
- `docs/DATA_MODEL.md` — schema
- `prd-refined.md` — what we are building and why
