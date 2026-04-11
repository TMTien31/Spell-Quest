# Spell-Quest Workspace

Workspace nay gom 2 phan chinh:

- `frontend/`: ung dung web React + Vite cho game Spell Quest.
- `backend/`: FastAPI backend skeleton (service layer, repository layer, migration).

## Chay Frontend Tu Root

Script o root dang forward vao `frontend/`:

```bash
npm run dev
npm run build
npm run preview
```

## Chay Backend

1. Di vao backend:

```bash
cd backend
```

2. Tao va kich hoat virtual environment (neu chua co).
3. Cai dependency:

```bash
pip install -e .[dev]
```

4. Chay API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

5. Chay test:

```bash
pytest -q
```

## Tai Lieu Theo Tung Phan

- Chi tiet frontend: `frontend/README.md`
- Chi tiet backend: `backend/README.md`
