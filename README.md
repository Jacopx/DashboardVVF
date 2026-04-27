# DashboardVVF 🚒

A web-based analytics dashboard for firefighter club operations.
Built to visualize and explore intervention data stored in a MariaDB database.

---

## Architecture

**Thin server, rich client** — the backend is a read-only JSON API; all computation, filtering, and rendering happens in the browser.

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

### Frontend
- **React + Vite** — UI framework and build tool
- **DuckDB-WASM** — in-browser SQL engine for client-side computation
- **TanStack Query** — data fetching and caching
- **TanStack Table** — sortable, filterable tables
- **Apache ECharts** — interactive charts
- **Tailwind CSS + shadcn/ui** — styling and components

---

## Database Schema

Four tables, read-only access:

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
| address | varchar(255) | Intervention address |
| caller | varchar(255) | Who placed the call |
| operator | varchar(255) | Operator who received the call |

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

**`staffExp`** — personnel registry

| Column | Type | Description |
|---|---|---|
| ID | int | Staff member ID |
| name / surname | varchar | Full name |
| role | varchar(4) | Role code (e.g. `CSV`) |
| status_label | varchar(8) | `ATTIVO`, `RITIRATO`, … |
| photo | varchar | Photo URL |
| phone | varchar | Mobile number |
| radio | int | Radio number |
| birthday / start | date | Date of birth / start of service |
| license / license_exp | int / date | Driving licence grade and expiry |
| medical / medical_exp | date | Medical visit date and expiry |
| address | varchar | Home address |
| week_shift / weekend_shift | varchar | Shift assignments |

**`vehiclesExp`** — vehicle registry

| Column | Type | Description |
|---|---|---|
| plate | varchar(9) | Primary key — licence plate |
| name / type | varchar | Display name and vehicle type |
| status_label | varchar(8) | Operational status |
| photo | varchar | Photo URL |
| weight | int | Vehicle weight (kg) |
| seats | int | Passenger capacity |
| data_reg / data_acquire | date | Registration and acquisition dates |
| limitations / description | varchar | Notes and restrictions |

> The composite primary key `(ID, year)` on `Operations` means IDs reset each year — all endpoints reflect this.

---

## Project Structure

```
DashboardVVF/
├── main.py                  # FastAPI app, CORS, router registration
├── database.py              # DB connection, session factory
├── models.py                # SQLAlchemy table definitions
├── schemas.py               # Pydantic response schemas
├── routers/
│   ├── __init__.py
│   ├── operations.py
│   ├── vehicles.py
│   └── staff.py
├── requirements.txt
├── .env                     # DB credentials (never commit this)
└── .env.example             # Credentials template
```

Frontend components follow a consistent pattern per entity:

```
<Entity>.jsx          # Page: fetches data, holds selected-row state
<EntityTable>.jsx     # TanStack Table with filters and view modes
<EntityDetail>.jsx    # Side panel shown when a row is selected
```

---

## Getting Started

```bash
git clone https://github.com/youruser/DashboardVVF.git
cd DashboardVVF
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your DB credentials
uvicorn main:app --reload --port 8000
```

Open [http://localhost:8000/docs](http://localhost:8000/docs) for Swagger UI.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/operations` | List operations (filterable) |
| GET | `/api/operations/{year}/full` | All operations for a year with dispatches |
| GET | `/api/operations/{year}/{id}` | Single operation with dispatches |
| GET | `/api/vehicles` | List all vehicles |
| GET | `/api/staff` | List all staff members |

### Query parameters — `GET /api/operations`

| Parameter | Type | Description |
|---|---|---|
| year | string | e.g. `2024` |
| typology | string | Partial match |
| boss | string | Partial match |
| date_from / date_to | string | `YYYY-MM-DD` range |
| limit | int | Default 1000, max 5000 |
| offset | int | Pagination offset |

---

## Computed Metrics (client-side, via DuckDB-WASM)

| Metric | Derivation |
|---|---|
| Response time | `dt_exit − date` |
| Travel time | `inplace_dt − exit_dt` per vehicle |
| Operation duration | `dt_close − date` |
| Time on scene | `back_dt − inplace_dt` per vehicle |
| Operations by typology / month / year | aggregation on `Operations` |
| Most dispatched vehicles | aggregation on `Starts` |
| Geographic map | from `x`, `y` coordinates |

---

## Notes

- The database is **written by a separate system** — this app is strictly read-only.
- All heavy computation happens **in the browser**, keeping the server stateless and lightweight.