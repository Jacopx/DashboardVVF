from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models import Start
from schemas import StartOut


router = APIRouter(prefix="/api/starts", tags=["starts"])


@router.get("/full", response_model=list[StartOut])
async def get_starts(db: AsyncSession = Depends(get_db), limit: int = Query(10000, le=50000),):
    """
    Return start list.
    """
    
    stmt = select(Start).order_by(Start.op_id.desc(), Start.id.desc()).limit(limit)
    result = await db.execute(stmt)
    
    return result.scalars().all()

@router.get("/{year}/{OpID}", response_model=list[StartOut])
async def get_start(db: AsyncSession = Depends(get_db), year: int = None, OpID: int = None):
    """
    Return a specific start.
    """
    
    stmt = select(Start).where(Start.year == year, Start.op_id == OpID)
    result = await db.execute(stmt)
    
    return result.scalars().all()