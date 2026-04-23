from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from database import get_db
from models import Staff
from schemas import StaffOut


router = APIRouter(prefix="/api/staff", tags=["staff"])


@router.get("", response_model=list[StaffOut])
async def get_staff(db: AsyncSession = Depends(get_db)):
    """
    Return staff list.
    """
    
    stmt = select(Staff).order_by(Staff.surname, Staff.name)
    result = await db.execute(stmt)
    
    return result.scalars().all()
