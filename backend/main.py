from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import operations, staff, vehicles, shifts, calendar, starts

app = FastAPI(
    title="VVF Ponzone Dashboard API",
    description="Read-only API for VVF Ponzone operations dashboard.",
    version="0.1.5",
    redirect_slashes=False,
)

# ---------------------------------------------------------------------------
# CORS — allow the React dev server (port 5173) to call this API
# In production, replace with your actual frontend domain
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(operations.router)
app.include_router(staff.router)
app.include_router(vehicles.router)
app.include_router(shifts.router)
app.include_router(calendar.router)
app.include_router(starts.router)

# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/api/health", tags=["health"])
async def health():
    return {"status": "ok"}

# ---------------------------------------------------------------------------
# Run with:  uvicorn main:app --reload --port 8000
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
