# FastAPI Backend Skeleton

This folder contains a clean backend skeleton for Spell Quest using FastAPI.

## Folder Structure

```text
backend/
  app/
    api/
      deps.py
      v1/
        router.py
        endpoints/
          health.py
    core/
      config.py
    db/
      base.py
      session.py
    models/
      __init__.py
    repositories/
      __init__.py
    schemas/
      __init__.py
    services/
      __init__.py
      health_service.py
    __init__.py
    main.py
  alembic/
    versions/
    env.py
    script.py.mako
  tests/
    __init__.py
    test_health.py
  .env.example
  alembic.ini
  pyproject.toml
```

## What Each Part Does

- `app/main.py`: App entrypoint. Creates FastAPI app and attaches routers.
- `app/core/config.py`: Centralized settings loaded from environment variables.
- `app/api/v1/router.py`: API v1 aggregator router.
- `app/api/v1/endpoints/health.py`: Health-check endpoint.
- `app/api/deps.py`: Shared dependency functions for routers.
- `app/services/`: Business logic layer.
- `app/repositories/`: Data-access layer (database queries, persistence).
- `app/schemas/`: Pydantic DTOs for request/response contracts.
- `app/models/`: SQLAlchemy ORM models.
- `app/db/session.py`: SQLAlchemy engine/session setup.
- `app/db/base.py`: Imports model metadata for Alembic.
- `alembic/`: Migration scripts and Alembic runtime config.
- `tests/test_health.py`: Basic API test example.
- `.env.example`: Required environment variable template.

## Quick Start

1. Create and activate a Python virtual environment.
2. Install dependencies:

```bash
pip install -e .
```

3. Copy env template:

```bash
cp .env.example .env
```

4. Run API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

5. Open docs:
- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

## Migrations

- Create migration:

```bash
alembic revision --autogenerate -m "init"
```

- Apply migration:

```bash
alembic upgrade head
```

## Suggested Next Steps

- Add real models in `app/models/`.
- Add matching schemas in `app/schemas/`.
- Implement repositories and services per feature domain.
- Add authentication and authorization middleware.
- Add CI for linting, tests, and migration checks.
