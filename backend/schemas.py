from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class StartOut(BaseModel):
    op_id:      int
    id:         int
    year:       str
    vehicle:    Optional[str]
    exit_dt:    Optional[datetime]
    inplace_dt: Optional[datetime]
    back_dt:    Optional[datetime]
    boss:       Optional[str]

    model_config = {"from_attributes": True}


class OperationOut(BaseModel):
    id:       int
    year:     str
    opn:      Optional[str]
    date:     Optional[date]
    dt_exit:  Optional[datetime]
    dt_close: Optional[datetime]
    typology: Optional[str]
    x:        Optional[str]
    y:        Optional[str]
    loc:      Optional[str]
    boss:     Optional[str]
    address:  Optional[str]
    caller:   Optional[str]
    operator: Optional[str]

    model_config = {"from_attributes": True}


class StaffOut(BaseModel):
    id:          int
    name:        Optional[str]
    surname:     Optional[str]
    role:        Optional[str]
    radio:       Optional[int]
    birthday:    Optional[date]
    start:       Optional[date]
    license:     Optional[int]
    license_exp: Optional[date]
    medical:     Optional[date]
    address:     Optional[str]
    weekend_shift: Optional[int]
    week_shift:    Optional[int]

    model_config = {"from_attributes": True}


class OperationDetailOut(OperationOut):
    """Single operation enriched with its vehicle dispatches."""
    starts: list[StartOut] = []