from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from database import get_db
from models import Operation, Start
from schemas import OperationOut, OperationDetailOut


router = APIRouter(prefix="/api/operations", tags=["operations"])

@router.get("", response_model=list[OperationOut])
async def get_operations(
    db:        AsyncSession  = Depends(get_db),
    year:      Optional[str] = Query(None, description="Filter by year e.g. 2023"),
    typology:  Optional[str] = Query(None, description="Filter by typology"),
    boss:      Optional[str] = Query(None, description="Filter by boss name"),
    date_from: Optional[str] = Query(None, description="Start date YYYY-MM-DD"),
    date_to:   Optional[str] = Query(None, description="End date YYYY-MM-DD"),
    limit:     int           = Query(10000, le=50000),
    offset:    int           = Query(0),
):
    """
    Return operations list.
    Basic filters are available here but heavy aggregations
    (group by month, response time stats etc.) are done
    client-side in DuckDB-WASM.
    """
    stmt = select(Operation)

    if year:
        stmt = stmt.where(Operation.year == year)
    if typology:
        stmt = stmt.where(Operation.typology.ilike(f"%{typology}%"))
    if boss:
        stmt = stmt.where(Operation.boss.ilike(f"%{boss}%"))
    if date_from:
        stmt = stmt.where(Operation.date >= date_from)
    if date_to:
        stmt = stmt.where(Operation.date <= date_to)

    stmt = stmt.order_by(Operation.date.desc(),Operation.id.desc()).limit(limit).offset(offset)

    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{year}/full", response_model=list[OperationDetailOut])
async def get_operations_with_starts(
    year: str,
    db:   AsyncSession = Depends(get_db)
):
    # Query 1 — All the operations for the given year
    op_result = await db.execute(
        select(Operation).where(Operation.year == year)
    )
    operations = op_result.scalars().all()

    # Query 2 — All the starts for the given year
    starts_result = await db.execute(
        select(Start).where(Start.year == year)
    )
    starts = starts_result.scalars().all()

    # Group starts by operation ID in-memory to avoid N+1 query problem
    from collections import defaultdict
    starts_by_op = defaultdict(list)
    for start in starts:
        starts_by_op[start.op_id].append(start)

    # Construct the response without DB
    return [
        OperationDetailOut(
            **OperationOut.model_validate(op).model_dump(),
            starts=starts_by_op[op.id],
        )
        for op in operations
    ]


@router.get("/{year}/{id}", response_model=OperationDetailOut)
async def get_operation_detail(
    year: str,
    id:   int,
    db:   AsyncSession = Depends(get_db),
):
    """
    Return a single operation by its composite key (year + ID),
    enriched with all vehicle dispatches from the Starts table.
    """
    op_result = await db.execute(
        select(Operation).where(
            Operation.id   == id,
            Operation.year == year,
        )
    )
    operation = op_result.scalar_one_or_none()

    if not operation:
        raise HTTPException(status_code=404, detail="Operation not found")

    starts_result = await db.execute(
        select(Start).where(
            Start.op_id == id,
            Start.year  == year,
        )
    )
    starts = starts_result.scalars().all()

    return OperationDetailOut(
        **OperationOut.model_validate(operation).model_dump(),
        starts=starts,
    )