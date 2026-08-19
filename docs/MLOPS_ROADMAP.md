# MLOps & Production Infrastructure Roadmap  --  Future Farms Framework (`arbane`)

> **Guide for integrating MLOps, Data Quality (Great Expectations), MLflow Experiment Tracking, Interactive Gradio UI, AWS ECS Cloud Infrastructure, and GitHub Actions CI/CD into the Future Farms Framework digital platform.**

---

## 🛠️ Step-by-Step Manual Setup Instructions

This section outlines all manual configuration requirements (environment variables, cloud resources, IAM permissions, and GitHub Secrets) required before implementing or deploying the automated pipelines.

---

### 1. Local & Staging Environment Variables (`.env`)

Add the following key-value pairs to your local [`.env`](file:///c:/Users/user/Desktop/Projects/arbane/.env) file:

```env
# ─── MLflow Configuration ─────────────────────────────────────────────
MLFLOW_TRACKING_URI=http://localhost:5000
MLFLOW_EXPERIMENT_NAME=fff_farm_risk_and_segmentation
MLFLOW_ARTIFACT_LOCATION=./mlruns

# ─── Great Expectations Data Validation ────────────────────────────────
GE_DATA_CONTEXT_DIR=src/backend/app/ml/great_expectations
GE_ENABLE_STRICT_VALIDATION=true

# ─── AWS Infrastructure Settings ──────────────────────────────────────
AWS_REGION=eu-west-1
AWS_ACCOUNT_ID=123456789012
ECR_REPOSITORY_BACKEND=fff-backend
ECR_REPOSITORY_WORKER=fff-worker
ECS_CLUSTER_NAME=fff-production-cluster
ECS_SERVICE_BACKEND=fff-backend-service
ECS_SERVICE_WORKER=fff-worker-service
```

---

### 2. GitHub Secrets Setup (CI/CD Pipeline)

Navigate to **GitHub Repository $\rightarrow$ Settings $\rightarrow$ Secrets and variables $\rightarrow$ Actions $\rightarrow$ New repository secret** and configure:

| Secret Name | Required Value / Description |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | AWS IAM User access key with permissions for ECR, ECS, and S3 |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM User secret access key |
| `AWS_REGION` | AWS Region (e.g., `eu-west-1` or `us-east-1`) |
| `AWS_ACCOUNT_ID` | 12-digit AWS Account Number |
| `DOCKERHUB_USERNAME` | *(Optional if using ECR)* Docker Hub username |
| `DOCKERHUB_TOKEN` | *(Optional if using ECR)* Docker Hub access token |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key for narrative generation fallback tests |

---

### 3. AWS Resource Provisioning (One-Time Manual Step)

Execute the following commands via AWS CLI or AWS Management Console prior to running cloud deployment jobs:

#### A. Amazon ECR Repositories
```bash
aws ecr create-repository --repository-name fff-backend --region eu-west-1
aws ecr create-repository --repository-name fff-worker --region eu-west-1
```

#### B. AWS ECS Fargate Cluster
```bash
aws ecs create-cluster --cluster-name fff-production-cluster --region eu-west-1
```

#### C. CloudWatch Logging Groups
```bash
aws logs create-log-group --log-group-name /ecs/fff-backend --region eu-west-1
aws logs create-log-group --log-group-name /ecs/fff-worker --region eu-west-1
```

#### D. Application Load Balancer (ALB) Setup
1. Create ALB named `fff-alb`.
2. Create Target Group `fff-backend-tg` (Port: 8000, Health check path: `/health`).
3. Point ALB listener on HTTP:80 / HTTPS:443 to `fff-backend-tg`.

---

## 🗺️ Implementation Roadmap Phases

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Dependencies & MLflow Tracking Setup                           │
├─────────────────────────────────────────────────────────────────────────┤
│ Phase 2: Ingestion Data Quality Guardrails (Great Expectations)          │
├─────────────────────────────────────────────────────────────────────────┤
│ Phase 3: Interactive Scenario & Simulation UI (Gradio + FastAPI)       │
├─────────────────────────────────────────────────────────────────────────┤
│ Phase 4: Local Docker Compose Stack Enhancement                          │
├─────────────────────────────────────────────────────────────────────────┤
│ Phase 5: AWS ECS Fargate & Infrastructure Specifications                │
├─────────────────────────────────────────────────────────────────────────┤
│ Phase 6: Continuous Integration & Deployment Pipeline (GitHub Actions)  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Phase 1: ML Pipeline & MLflow Experiment Tracking
- **Dependencies:** Add `mlflow`, `great-expectations`, `gradio`, `optuna` to [`pyproject.toml`](file:///c:/Users/user/Desktop/Projects/arbane/pyproject.toml) and [`requirements.txt`](file:///c:/Users/user/Desktop/Projects/arbane/requirements.txt).
- **MLflow Wrapper (`src/backend/app/ml/tracking.py`):** Create isolated MLflow run initializer context for Celery worker processes.
- **Batch Jobs Update (`src/backend/app/ml/jobs.py`):** Wrap farm clustering and risk trajectory jobs with `mlflow.start_run()` to track hyperparameters, silhouette scores, AUC metrics, and save serialized `.pkl`/`.xgb` artifacts.

### Phase 2: Ingestion Data Quality Guardrails (Great Expectations)
- **Validation Module (`src/backend/app/ml/validation.py`):** Define expectation suites for self-assessment survey answers (verifying question range [0, 1], question IDs stability) and verifier evidence metadata (GPS coordinate bounds, timestamp chronology).
- **API Guardrails (`src/backend/app/api/v1/assessments.py`):** Enforce data validation prior to score calculation or database persistence.

### Phase 3: Interactive Scenario & Inference UI (Gradio)
- **Gradio Module (`src/backend/app/api/v1/gradio_app.py`):** Build an interactive farm simulator for agronomists/verifiers to test pillar scores and visualize instantaneous FFMI maturity tier, risk trajectory predictions, and Quick Win recommendations.
- **FastAPI Integration (`src/backend/app/main.py`):** Mount Gradio application at `/ml-demo` via `gradio.mount_gradio_app()`.

### Phase 4: Local Stack Enhancement (Docker Compose)
- **MLflow Service (`deploy/docker-compose.yml`):** Add `mlflow` container service listening on port `5000` with local artifact volume mount `./mlruns`.
- **Environment Mapping:** Configure `backend` and `worker` services to report to `http://mlflow:5000`.

### Phase 5: AWS Cloud Deployment Specifications
- **Task Definitions (`deploy/aws/ecs-task-definition-backend.json` & `ecs-task-definition-worker.json`):** Configure Fargate task specifications (0.5 vCPU, 1GB RAM) with CloudWatch logging drivers.

### Phase 6: Continuous Integration & Deployment (GitHub Actions)
- **Workflow (`.github/workflows/ci-cd.yml`):** Automatically run Pytest suite, build Docker containers, push tagged images to Amazon ECR, and trigger rolling ECS service deployments upon merges to `main`.

---

## 🧪 Verification & Acceptance Criteria

1. **Local Test Suite:** `pytest` passes cleanly across scoring, validation, and ML job modules.
2. **MLflow Interface:** `http://localhost:5000` displays logged runs, hyperparameters, and serialized model artifacts.
3. **Gradio UI:** `http://localhost:8000/ml-demo` renders smoothly and calculates live farm trajectory predictions.
4. **CI/CD Build:** GitHub Actions workflow completes successfully on push to `main`.
