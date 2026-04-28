from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models import Staff, StaffWrite
from schemas import StaffOut, StaffUpdate


router = APIRouter(prefix="/api/staff", tags=["staff"])


@router.get("", response_model=list[StaffOut])
async def get_staff(db: AsyncSession = Depends(get_db)):
    """
    Return staff list.
    """
    
    stmt = select(Staff).order_by(Staff.status_label, Staff.role, Staff.surname, Staff.name)
    result = await db.execute(stmt)
    
    return result.scalars().all()


@router.put("/{staff_id}", response_model=StaffOut)
async def update_staff(staff_id: int, payload: StaffUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StaffWrite).where(StaffWrite.id == staff_id))
    staff = result.scalar_one_or_none()

    if not staff:
        raise HTTPException(status_code=404, detail="Personale non trovato")

    staff.medical = payload.medical
    staff.license_exp = payload.license_exp

    await db.commit()
    await db.refresh(staff)

    result = await db.execute(select(Staff).where(Staff.id == staff_id))
    return result.scalar_one()
