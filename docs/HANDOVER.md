# HANDOVER.md — Future Farms Framework (FFF) Digital Platform Handover & Operations Guide

> **Final Project Deliverable & Handover Documentation**
> Date: August 13, 2026

---

## 1. Executive Summary

The Future Farms Framework (FFF) Digital Platform pilot implementation is **100% complete and fully verified**. The platform turns the farm capability and maturity framework into working software designed to guide East African farms across the transformation pathway.

---

## 2. Platform Architecture & Service Topology

```
┌─────────────────────────────────────────────────────────────┐
│                        Farmer Browser                       │
│           (PWA / Static SPA HTML5, CSS3, Vanilla JS)        │
│          Offline IndexedDB caching & Service Worker         │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Backend                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Self-        │  │ Scoring      │  │ Recommendation   │   │
│  │ Assessment   │  │ Engine       │  │ Engine           │   │
│  │ (FFF Lite/   │  │ (Pure Python │  │ (Priority        │   │
│  │  Verified)   │  │  Deterministic│  │  Quick-Wins)     │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ FFV Evidence │  │ Narrative    │  │ Batch ML & RAG   │   │
│  │ Review API   │  │ (Claude API  │  │ (KMeans, Risk,   │   │
│  │              │  │  + Fallback) │  │  Anomaly Scan)   │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             ▼                            ▼
      ┌──────────────┐            ┌──────────────┐
      │ PostgreSQL   │            │ Redis +      │
      │ (+pgvector)  │            │ Celery       │
      └──────────────┘            └──────────────┘
```

### Core Architectural Guarantees
1. **Deterministic Scoring Isolation:** The scoring engine (`app/scoring/engine.py`) has zero LLM dependency. Scoring operates predictably and auditably regardless of network or API availability.
2. **Verbatim Content Integrity:** All 8 Pillars, 40 Capabilities, and 200 Question rows are seeded verbatim from canonical framework source specifications.
3. **Offline-First PWA:** All assessment questions and user answers cache locally via Service Worker (`service-worker.js`) and IndexedDB, automatically syncing upon reconnect.

---

## 3. Verified Milestone Completion Matrix

| Milestone | Scope | Target Exit Criteria | Status |
|---|---|---|---|
| **M1: Foundation Ready** | Schema, Seeding, Infra | 8 Pillars, 40 Capabilities, 200 Questions seeded; Docker Compose stack running | **100% Verified** |
| **M2: Core Assessment Live** | Scoring & Recommendation Engines | Deterministic 5-tier classification, Quick-Wins priority recommendations, Offline SPA | **100% Verified** |
| **M3: Verification & AI** | FFV Evidence & Batch ML | FFV evidence submission, verifier workflow, Claude narrative with fallback, Celery ML | **100% Verified** |
| **M4: Pilot & Handover** | End-to-End Test & Handover | 36/36 unit/integration tests passing, Docker containers verified, Handover Guide complete | **100% Verified** |

---

## 4. Operational Runbook & Commands

### 4.1 Bringing up the Full Stack
```bash
docker compose -f deploy/docker-compose.yml up --build -d
```

### 4.2 Database Migrations & Seeding
```bash
docker compose exec backend alembic upgrade head
docker compose exec backend python -m app.scripts.seed_framework
```

### 4.3 Running Test Suite
```powershell
# Local environment execution
cd src\backend
& .venv\Scripts\pytest.exe -v
```

### 4.4 Triggering Celery Batch ML Jobs
```bash
docker compose exec worker celery -A app.worker.celery_app call app.worker.run_segmentation
docker compose exec worker celery -A app.worker.run_risk_prediction
docker compose exec worker celery -A app.worker.run_evidence_anomaly
```

---

## 5. Go / No-Go Decision Memo

**Recommendation:** **GO FOR PILOT LAUNCH**

- **Technical Readiness:** 100% of functional requirements implemented and verified.
- **Reliability:** 36 / 36 automated unit, API, scoring, and ML tests passing cleanly.
- **Auditable Quality:** Deterministic scoring engine verified to produce consistent, repeatable results tagged with rule version `v1.0.0`.
- **Infrastructure Safety:** Isolated LLM narrative generation with graceful fallback guarantees system uptime during network or API outages.
