# Future Farms Framework (FFF) Digital Platform

> **A farm transformation architecture and digital capability platform designed for East African farm systems.**
> Target Ambition: Supporting **100,000 future-ready farm systems across East Africa by 2035**.

---

## 🌾 Overview

The **Future Farms Framework (FFF) Digital Platform** operationalizes the FFF maturity architecture into accessible, offline-first web software. Rather than acting as a simple pass/fail questionnaire, the platform provides a continuous transformation loop for farmers, agribusinesses, advisors, and verifiers:

$$\text{Assess} \longrightarrow \text{Diagnose} \longrightarrow \text{Prioritise} \longrightarrow \text{Learn} \longrightarrow \text{Implement} \longrightarrow \text{Verify} \longrightarrow \text{Measure} \longrightarrow \text{Advance}$$

### Key Deliverables
- **FFF Lite:** An affordable, offline-first self-assessment tool for farmers to evaluate maturity across 8 pillars and receive instant recommendations.
- **FFF Verified:** An evidence-backed assessment pathway (Photos, GPS, Timestamps) for accredited verifiers and agricultural organizations.
- **FFF Insights & ML:** Batch farm segmentation, trajectory risk prediction, and evidence anomaly scanning powered by background Celery workers.

---

## 🚀 Key Features

- **200-Question Domain Framework:** 8 Pillars, 40 Capabilities (5 per pillar), and 200 Questions seeded verbatim from the canonical source specification.
- **Deterministic Scoring Engine:** 100% pure Python scoring engine with zero LLM dependency. Calculates 6-level capability statuses (`non_existent` to `advanced`), composite FFMI/24 index scores, and maps farms to 5 maturity tiers (`Informal Farm` to `Future Ready Farm`).
- **Data-Driven Recommendations:** Automatically surfaces per-gap action plans prioritized with **Quick Wins** first, mapped to FFF Services and FAAB Learning Resources.
- **Offline-First PWA:** Built with a cache-first Service Worker (`service-worker.js`) and IndexedDB local storage. Automatically computes results locally if offline and syncs when reconnected.
- **LLM Narrative & Fallback:** Executive summary generation powered by Anthropic Claude API with architectural isolation fallback to ensure 100% uptime during network outages.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Backend API** | FastAPI (Python 3.11+) |
| **Database** | PostgreSQL + `pgvector` (SQLite fallback for local quick-start) |
| **Frontend SPA** | Vanilla HTML5 / CSS3 / JavaScript (Zero-build PWA) |
| **Containerization** | Docker & Docker Compose (`deploy/docker-compose.yml`) |
| **Task Queue & ML** | Celery + Redis (scikit-learn, XGBoost/LightGBM, pandas) |
| **LLM Integration** | Hosted Anthropic Claude API (`claude-sonnet-4-5`) |

---

## 💻 Quickstart & Local Setup

### Option A: Local Python Virtual Environment (Quickest)

#### 1. Clone & Navigate
```bash
git clone <repository-url> arbarne
cd arbarne/src/backend
```

#### 2. Create & Activate Virtual Environment
```powershell
# Windows (PowerShell)
python -m venv .venv
& .venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv .venv
source .venv/bin/activate
```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Seed Framework Data (8 Pillars, 40 Capabilities, 200 Questions)
```powershell
# Uses SQLite (fff_dev.db) out of the box when no Postgres URL is provided
$env:DATABASE_URL="sqlite:///fff_dev.db"
python -m app.scripts.seed_framework
```

#### 5. Launch Application Server
```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 6. Access in Browser
Open **[http://localhost:8000/](http://localhost:8000/)** in your web browser.

---

### Option B: Docker Compose (Full Stack)

#### 1. Configure Environment
```bash
cp .env.example .env
```

#### 2. Start Containers (Postgres, Redis, FastAPI, Worker, Frontend)
```bash
docker compose -f deploy/docker-compose.yml up --build -d
```

#### 3. Run Migrations & Seeding
```bash
docker compose -f deploy/docker-compose.yml exec backend alembic upgrade head
docker compose -f deploy/docker-compose.yml exec backend python -m app.scripts.seed_framework
```

#### 4. Access Services
- **Frontend SPA:** [http://localhost:8080/](http://localhost:8080/)
- **Backend API:** [http://localhost:8000/](http://localhost:8000/)
- **API Interactive Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧪 Running the Test Suite

The test suite validates the API, deterministic scoring engine, recommendation logic, narrative fallbacks, and ML jobs.

### Run via Local Virtual Environment
```powershell
cd src\backend
$env:DATABASE_URL="sqlite:///fff_dev.db"
& .venv\Scripts\pytest.exe -v
```

### Run via Docker
```bash
docker compose -f deploy/docker-compose.yml exec backend pytest -v
```

**Status:** 36 / 36 unit and integration tests passing (100% pass rate).

---

## 📁 Repository Structure

```
arbarne/
├── README.md            ← this file (getting started & overview)
├── CLAUDE.md            ← developer reference & architectural guidelines
├── PLANNING.md          ← master plan, milestones, & service topology
├── TASKS.md             ← granular task tracker & sprint alignment
├── PROGRESS_TRACKER.md  ← live milestone status & component matrix
├── prd-refined.md       ← authoritative Product Requirements Document (PRD)
├── requirements.txt     ← backend Python dependencies
├── pyproject.toml       ← hatchling project config & ruff/pytest settings
├── docs/
│   ├── HANDOVER.md      ← platform operations & handover guide
│   ├── SETUP.md         ← detailed local environment setup
│   ├── DATA_MODEL.md    ← database schema & ER diagram
│   ├── DECISIONS.md     ← decision log & signed-off FFMI bands
│   ├── GLOSSARY.md      ← FFF domain vocabulary
│   └── SOURCE_INDEX.md  ← source material inventory
├── src/
│   ├── backend/         ← FastAPI application, models, scoring, API routers
│   ├── frontend/        ← static SPA (index.html, app.js, styles.css, PWA worker)
│   └── worker/          ← Celery worker & ML batch job entries
└── deploy/
    └── docker-compose.yml ← Docker multi-container stack definition
```

---

## 📖 Key Documentation Links

- 📋 [**PROGRESS_TRACKER.md**](PROGRESS_TRACKER.md) — Current implementation completion status
- 📦 [**docs/HANDOVER.md**](docs/HANDOVER.md) — Operational runbook & handover documentation
- 🛠️ [**docs/SETUP.md**](docs/SETUP.md) — In-depth setup & environment guide
- 📐 [**docs/DATA_MODEL.md**](docs/DATA_MODEL.md) — Database schema breakdown
- 📝 [**docs/DECISIONS.md**](docs/DECISIONS.md) — Architecture & domain decision log

---

## ⚖️ License & Credits

Built by the Future Farms Framework Engineering Team.
Designed for farm transformation and capability development across East Africa.
