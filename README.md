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
| **Frontend UI** | React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons |
| **ML Simulation** | Gradio Interactive Simulation Studio (`/ml-demo`) |
| **Containerization** | Docker & Docker Compose (`deploy/docker-compose.yml`) |
| **Task Queue & ML** | Celery + Redis (scikit-learn, XGBoost/LightGBM, pandas) |
| **LLM Integration** | Hosted Anthropic Claude API (`claude-sonnet-4-5`) |

---

## 💻 Quickstart & Local Setup

### Option A: Local Fast-Dev Mode (Recommended for Development)

Run the backend and frontend in separate terminals for instant hot-reloading.

#### 1. Configure Environment
```bash
# Clone the repository
git clone https://github.com/Arbarne-group/arbarne.git
cd arbarne

# Copy the environment file
cp .env.example .env     # Linux / macOS
copy .env.example .env   # Windows
```

---

#### 2. Start the Backend (FastAPI on Port 8000)
Open your **first terminal**:
```powershell
cd src/backend

# Create & activate virtual environment
python -m venv .venv

# Windows (PowerShell)
.venv\Scripts\Activate.ps1

# Linux / macOS
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations & seed framework data (8 Pillars, 40 Capabilities, 200 Questions)
alembic upgrade head
python -m app.scripts.seed_framework

# Launch the FastAPI backend
uvicorn app.main:app --reload --port 8000
```
- 🟢 **Backend API:** [http://localhost:8000](http://localhost:8000)
- 📖 **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- 🔬 **ML Simulation Studio:** [http://localhost:8000/ml-demo](http://localhost:8000/ml-demo)

---

#### 3. Start the Frontend (Vite + React on Port 5173)
Open a **second terminal**:
```powershell
cd src/frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
- 🟢 **Frontend UI:** [http://localhost:5173](http://localhost:5173) *(Vite automatically proxies API requests to `http://localhost:8000`)*

---

#### 4. Verify Everything Is Running
From the root directory, run the built-in system verification check:
```powershell
python src/backend/verify_running_servers.py
```

---

### Option B: Docker Compose (Full Stack with Postgres & Redis)

#### 1. Start Stack Containers
```bash
docker compose -f deploy/docker-compose.yml up --build -d
```

#### 2. Run Migrations & Seeding
```bash
docker compose -f deploy/docker-compose.yml exec backend alembic upgrade head
docker compose -f deploy/docker-compose.yml exec backend python -m app.scripts.seed_framework
```

#### 3. Access Services
- **Frontend SPA:** [http://localhost:8080/](http://localhost:8080/)
- **Backend API:** [http://localhost:8000/](http://localhost:8000/)
- **Swagger API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ML Simulator:** [http://localhost:8000/ml-demo](http://localhost:8000/ml-demo)

---

## 🧪 Running the Test Suite

The test suite validates the API, deterministic scoring engine, recommendation logic, narrative fallbacks, and ML jobs.

### Run via Local Virtual Environment
```powershell
cd src/backend
pytest -v

# Scoring engine specific tests
pytest tests/test_scoring.py -v
```

### Run via Docker
```bash
docker compose -f deploy/docker-compose.yml exec backend pytest -v
```

---

## 📁 Repository Structure

```
arbarne/
├── README.md            ← this file (getting started & overview)
├── CLAUDE.md            ← developer reference & architectural guidelines
├── PLANNING.md          ← master plan, milestones, & service topology
├── TASKS.md             ← granular task tracker & sprint alignment
├── PROGRESS_TRACKER.md  ← live milestone status & component matrix
├── requirements.txt     ← backend Python dependencies
├── pyproject.toml       ← hatchling project config & ruff/pytest settings
├── docs/
│   ├── prd/             ← Product Requirements Documents (prd-refined.md & prd-4.md)
│   ├── HANDOVER.md      ← platform operations & handover guide
│   ├── SETUP.md         ← detailed local environment setup
│   ├── DATA_MODEL.md    ← database schema & ER diagram
│   ├── DECISIONS.md     ← decision log & signed-off FFMI bands
│   ├── GLOSSARY.md      ← FFF domain vocabulary
│   └── SOURCE_INDEX.md  ← source material inventory
├── src/
│   ├── backend/         ← FastAPI application, models, scoring, API routers, ML studio
│   ├── frontend/        ← React 19 + TypeScript + Vite + Tailwind UI
│   └── worker/          ← Celery worker & ML batch job entries
└── deploy/
    └── docker-compose.yml ← Docker multi-container stack definition
```

---

## 📖 Key Documentation Links

- 📊 [**docs/TECHNICAL_DIAGRAMS_AND_FLOWS.md**](docs/TECHNICAL_DIAGRAMS_AND_FLOWS.md) — Comprehensive technical diagrams & architecture flows
- 🎨 [**docs/diagrams/index.html**](docs/diagrams/index.html) — Interactive HTML diagram portfolio & showcase
- 📋 [**PROGRESS_TRACKER.md**](PROGRESS_TRACKER.md) — Current implementation completion status
- 📦 [**docs/HANDOVER.md**](docs/HANDOVER.md) — Operational runbook & handover documentation
- 🛠️ [**docs/SETUP.md**](docs/SETUP.md) — In-depth setup & environment guide
- 📐 [**docs/DATA_MODEL.md**](docs/DATA_MODEL.md) — Database schema breakdown
- 📝 [**docs/DECISIONS.md**](docs/DECISIONS.md) — Architecture & domain decision log

---

## ⚖️ License & Credits

Built by the Future Farms Framework Engineering Team.
Designed for farm transformation and capability development across East Africa.
