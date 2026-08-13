# Future Farms Framework — convenience targets
# Most of the heavy lifting is via docker compose; this Makefile just wraps it.

.PHONY: help up down build logs ps restart shell-backend shell-db \
        migrate seed seed-pillars seed-pillars-all test test-scoring smoke \
        clean reset

COMPOSE = docker compose -f deploy/docker-compose.yml
BACKEND = $(COMPOSE) exec -T backend
DB = $(COMPOSE) exec -T postgres

help: ## Show this help
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Build and start the stack
	$(COMPOSE) up --build

down: ## Stop the stack
	$(COMPOSE) down

build: ## Build images
	$(COMPOSE) build

logs: ## Tail logs
	$(COMPOSE) logs -f

ps: ## List running services
	$(COMPOSE) ps

restart: ## Restart the backend
	$(COMPOSE) restart backend

shell-backend: ## Open a shell in the backend container
	$(COMPOSE) exec backend bash

shell-db: ## Open a psql shell in the postgres container
	$(COMPOSE) exec postgres psql -U $${POSTGRES_USER:-fff} -d $${POSTGRES_DB:-fff}

migrate: ## Run Alembic migrations
	$(BACKEND) alembic upgrade head

seed: ## Seed all 200 questions + 8 pillars + 40 capabilities
	$(BACKEND) python -m app.scripts.seed_framework

seed-pillars: ## Seed pillars only (idempotent)
	$(BACKEND) python -m app.scripts.seed_pillars

seed-pillars-all: ## Seed all 8 pillars (utility)
	$(BACKEND) python -m app.scripts.seed_pillars --all

test: ## Run all tests
	$(BACKEND) pytest

test-scoring: ## Run scoring engine tests
	$(BACKEND) pytest tests/test_scoring.py -v

smoke: ## End-to-end smoke (after `up`)
	@echo "Health check:"
	@curl -fsS http://localhost:8000/health && echo
	@echo "Pillar count:"
	@curl -fsS http://localhost:8000/api/pillars | python -c "import json, sys; print(len(json.load(sys.stdin)))"

clean: ## Stop stack and remove containers
	$(COMPOSE) down

reset: ## Stop stack, remove volumes, bring back up clean
	$(COMPOSE) down -v
	$(COMPOSE) up --build -d
	$(MAKE) migrate
	$(MAKE) seed
