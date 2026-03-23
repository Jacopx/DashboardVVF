# DashboardVVF 🚒

A web-based analytics dashboard for firefighters club operations.
Built to visualize and explore intervention data stored in a MariaDB database.

---

## Architecture

The system follows a **thin server, rich client** approach:

- The backend is a **read-only API** — it fetches data from MariaDB and returns JSON, nothing more
- The frontend handles all **computation, filtering, and chart rendering** client-side using DuckDB-WASM

```
MariaDB → FastAPI (Python) → React + DuckDB-WASM (Browser)
```

---

## Tech Stack

### Backend
- **FastAPI** — web framework
- **SQLAlchemy 2.0** — async ORM
- **aiomysql** — async MariaDB driver
- **Uvicorn** — ASGI server

### Frontend _(coming)_
- **React + Vite** — UI framework and build tool
- **DuckDB-WASM** — in-browser SQL engine for client-side computation
- **TanStack Query** — data fetching and caching
- **TanStack Table** — sortable, filterable tables
- **Apache ECharts** — interactive charts
- **Tailwind CSS + shadcn/ui** — styling and components

---

## Database Schema

Two tables, read-only access:

**`Operations`** — one row per intervention
| Column | Type | Description |
|---|---|---|
| ID | int | Operation ID (resets each year) |
| year | varchar(4) | Year of the operation |
| opn | varchar(255) | Operation code/number |
| date | date | Date the call was received |
| dt_exit | datetime | Datetime the team departed |
| dt_close | datetime | Datetime the operation was closed |
| typology | varchar(500) | Type of intervention |
| x, y | varchar(255) | Geographic coordinates |
| loc | varchar(255) | Location description |
| boss | varchar(255) | Officer in charge |

**`Starts`** — one row per vehicle dispatched within an operation
| Column | Type | Description |
|---|---|---|
| OpID | int | Reference to Operations.ID |
| ID | int | Dispatch ID |
| year | varchar(4) | Year |
| vehicle | varchar(255) | Vehicle name |
| exit_dt | datetime | When the vehicle left the station |
| inplace_dt | datetime | When it arrived on scene |
| back_dt | datetime | When it returned to station |
| boss | varchar(255) | Vehicle crew leader |

---

## Project Structure

```
DashboardVVF/
├── main.py            # FastAPI app, CORS, router registration
├── database.py        # DB connection, session factory
├── models.py          # SQLAlchemy table definitions
├── schemas.py         # Pydantic response schemas
├── routers/
│   ├── __init__.py
│   └── operations.py  # All operation endpoints
├── requirements.txt
├── .env               # DB credentials (never commit this)
└── .env.example       # Credentials template
```

---

## Getting Started

### 1. Clone and set up the environment

```bash
git clone https://github.com/youruser/DashboardVVF.git
cd DashboardVVF
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure the database

```bash
cp .env.example .env
```

Edit `.env` with your MariaDB credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
```

> It is recommended to create a dedicated **read-only** MariaDB user for this app.

### 3. Run the backend

```bash
uvicorn main:app --reload --port 8000
```

### 4. Explore the API

Open [http://localhost:8000/docs](http://localhost:8000/docs) for the interactive API docs.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/operations` | List operations (filterable) |
| GET | `/api/operations/{year}/full` | All operations for a year with vehicle dispatches |
| GET | `/api/operations/{year}/{id}` | Single operation with vehicle dispatches |

### Query parameters for `GET /api/operations`

| Parameter | Type | Description |
|---|---|---|
| year | string | Filter by year e.g. `2024` |
| typology | string | Partial match on typology |
| boss | string | Partial match on boss name |
| date_from | string | Start date `YYYY-MM-DD` |
| date_to | string | End date `YYYY-MM-DD` |
| limit | int | Max rows returned (default 1000, max 5000) |
| offset | int | Pagination offset |

---

## Computed Metrics (client-side)

Once data is loaded into DuckDB-WASM, the frontend can derive:

- **Response time** — `dt_exit - date`
- **Travel time** — `inplace_dt - exit_dt` per vehicle
- **Operation duration** — `dt_close - date`
- **Time on scene** — `back_dt - inplace_dt` per vehicle
- **Operations by typology, month, year**
- **Most dispatched vehicles**
- **Geographic map** from `x`, `y` coordinates

---

## Notes

- The database is **written by a separate system** — this app is strictly read-only
- All heavy computation happens **in the browser**, keeping the server lightweight
- The composite primary key `(ID, year)` on Operations means IDs reset each year — all endpoints reflect this