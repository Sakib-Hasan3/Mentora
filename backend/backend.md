**Backend: Production Recommendation and Runbook (বাংলা)**

এই ডকটি বলে দিচ্ছে কীভাবে এবং কেন `FastAPI` ভিত্তিক ব্যাকএন্ড ব্যবহার করা উচিত, কী কম্পোনেন্ট দরকার, কিভাবে লোকালি ও প্রোডাকশনে চালাবেন, এবং নিরাপত্তা ও ডেপ্লয়মেন্ট নোট।

**সংক্ষেপ সিদ্ধান্ত**
- বেস্ট অপশন: FastAPI + SQLAlchemy + PostgreSQL + Alembic + Uvicorn/Gunicorn
- হার্ডেনিং: password hashing (Passlib), JWT auth (python-jose), env-managed secrets
- মডেল সার্ভিং: আপনার `.pkl` মডেল `backend/models/`-এ রেখে FastAPI স্টার্টআপে লোড করা

**কেন FastAPI? (কারণগুলো)**
- দ্রুত ও টাইপ-সেফ ডেভেলপমেন্ট: Pydantic দিয়ে ইনপুট ভ্যালিডেশন সহজ।
- Async-ready: উচ্চ কনকারেন্সি/latency-sensitive endpoints এ সুবিধা।
- Auto docs (OpenAPI/Swagger) — ডেভ ও QA সুবিধার্থে।
- Ecosystem: Uvicorn/Gunicorn, Starlette, হতাশাজনকভাবে ভালো পারফরম্যান্স।

**Principal Components ও টুলকিট**
- FastAPI: Web framework
- Uvicorn (dev) + Gunicorn + Uvicorn workers (prod) as process manager
- SQLAlchemy: ORM
- Alembic: DB migrations
- PostgreSQL: production DB (SQLite dev only)
- passlib[bcrypt]: Password hashing
- python-jose: JWT token handling
- joblib / pickle: Local model (.pkl) loading (trusted sources)

**Environment variables (প্রস্তাবিত)**
- DATABASE_URL: postgresql://user:pass@host:5432/dbname
- SECRET_KEY: Random secret for signing JWTs
- MODEL_PATH: path to your .pkl model (e.g., /app/models/my_model.pkl)
- ENV: dev|prod
- SENTRY_DSN (optional): monitoring

**Development (lokal) setup**
1. Python environment তৈরি করুন (venv বা tox/Poetry):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. `backend/requirements.txt` (উদাহরণ):

```
fastapi
uvicorn[standard]
sqlalchemy
alembic
psycopg2-binary
passlib[bcrypt]
python-jose[cryptography]
python-multipart
joblib
```

3. DB লোকাল (SQLite dev) মডেল তৈরি:

```bash
# উদাহরণ: app/models.py তে Base metadata আছে ধরে
python -c "from app.db import engine; from app.models import Base; Base.metadata.create_all(bind=engine)"
```

4. Run dev server:

```bash
uvicorn app.main:app --reload --port 8000
```

**Production রিকমেন্ডেশন**
- DB: Postgres managed instance (Azure/AWS/GCP) বা RDS
- Process manager: Gunicorn with Uvicorn workers
  - উদাহরণ: `gunicorn -k uvicorn.workers.UvicornWorker -w 4 app.main:app`
- Containerization: Dockerfile + Docker Compose / Kubernetes
- Migrations: use Alembic; deploy pipeline এ `alembic upgrade head` চালান
- Secrets: Use environment variables or secret manager (Azure Key Vault, AWS Secrets Manager)
- Observability: metrics (Prometheus), logs (structured JSON), error-tracking (Sentry)

**Model (.pkl) সার্ভিং নোটস**
- Load once at startup: use `@app.on_event("startup")` to load model into memory.
- Use `joblib.load()` for scikit-learn models. Avoid untrusted pickles.
- If model uses heavy CPU, consider separate model-serving process (BentoML/TorchServe) বা scale horizontally.

**Security Best Practices**
- Passwords: `passlib.context.CryptContext` দিয়ে hash করুন (bcrypt/argon2)।
- Never store secrets in repo. `.env` files should be in `.gitignore`.
- Rate-limit auth endpoints and consider account lockout policies.
- Use HTTPS + HSTS in production.
- Input validation: rely on Pydantic schemas.

**Database schema recommendations (minimum)**
- `users` table:
  - id (UUID/serial PK)
  - email (unique)
  - hashed_password
  - name
  - phone (nullable)
  - created_at (timestamp)
  - is_active (boolean)

- Additional: `journals` or `entries` table for user content with FK to `users.id`.

**Example snippets**
- Password hashing (passlib):

```python
from passlib.context import CryptContext
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)
```

- Loading model at startup:

```python
from joblib import load
import os

MODEL_PATH = os.getenv("MODEL_PATH", "models/my_model.pkl")
model = None

@app.on_event("startup")
def load_model():
    global model
    model = load(MODEL_PATH)
```

- Signup flow (outline)
  1. Receive `UserCreate` schema (email,name,password)
  2. Check uniqueness by email
  3. Hash password & insert user row
  4. Return 201 with user summary (no password)

**CI/CD & Deployment notes**
- Build Docker image in CI, run tests and Alembic migrations in deployment job.
- Use rolling updates or blue/green to avoid downtime on model reloads.
- Keep migrations in source control and run `alembic upgrade head` as part of deploy.

**Scaling & performance**
- Use connection pool for DB (SQLAlchemy engine pool).
- For CPU/ML-bound inference, separate worker processes or model serving infra.
- Use caching (Redis) for expensive repeated operations.

**Backwards compatibility & versioning**
- Maintain API versioning (e.g., `/api/v1/`) if you expect breaking changes.
- Keep model artifacts versioned (e.g., `my_model_v2026-06-01.pkl`) and expose model version on health endpoint.

**Operational Endpoints**
- `/health` : basic app status
- `/metrics`: Prometheus metrics (optional)
- `/api/model-health` : model loaded + version
- Admin-only `/admin/reload-model` (optional) to reload `.pkl`

**Summary Recommendation**
- আপনার জন্য production-ready স্ট্যাক হিসেবে `FastAPI + PostgreSQL + SQLAlchemy + Alembic` সবচেয়ে সোজা এবং শক্তিশালী হবে।
- মডেল সার্ভিং সহজ: `.pkl` ব্যবহার করলে startup এ লোড করুন; কিন্তু production-scale inference হলে আলাদা model server বিবেচনা করুন।

---

এই ডকটি প্রয়োজনমতো expand করা যাবে — চাইলে আমি আপনার রিপোতে নিম্নলিখিত ফাইলগুলো যোগ করে দেব:
- `backend/app/models.py` (SQLAlchemy User model)
- `backend/app/schemas.py` (Pydantic schemas)
- `backend/app/crud.py` (DB operations)
- `backend/requirements.txt` আপডেট
- `backend/Dockerfile` এবং `docker-compose.yml` service example

বলুন আমি কোনগুলো automate করে দিই — আমি সেগুলো করে যোগ করে দেব এবং লোকাল চালানোর commands দেব।
