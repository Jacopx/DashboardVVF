from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from collections import defaultdict

from database import get_db

router = APIRouter(prefix="/api/shifts", tags=["shifts"])


def classify(member):
    if member["role"] == "CSV":
        return "capi_partenza"
    if member["license"] and member["license"] >= 3:
        return "autisti"
    return "vigili"


@router.get("")
async def get_shifts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        text("SELECT * FROM shift_members ORDER BY shift_type, shift_name")
    )
    rows = [dict(r._mapping) for r in result]

    shifts = {
        "week": defaultdict(lambda: {"capi_partenza": [], "autisti": [], "vigili": []}),
        "weekend": defaultdict(
            lambda: {"capi_partenza": [], "autisti": [], "vigili": []}
        ),
    }

    for row in rows:
        category = classify(row)
        member = {
            "id": row["ID"],
            "name": row["name"],
            "surname": row["surname"],
            "role": row["role"],
            "license": row["license"],
        }
        shifts[row["shift_type"]][row["shift_name"]][category].append(member)

    return shifts
