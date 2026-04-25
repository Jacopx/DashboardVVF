from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from database import get_db
from models import Vehicle
from schemas import VehicleOut


router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])


@router.get("", response_model=list[VehicleOut])
async def get_vehicles(db: AsyncSession = Depends(get_db)):
    """
    Return vehicle list.
    """
    
    stmt = select(Vehicle).order_by(Vehicle.plate)
    result = await db.execute(stmt)
    
    return result.scalars().all()
