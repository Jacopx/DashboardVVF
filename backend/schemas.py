from pydantic import BaseModel, model_validator
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
    note:     Optional[str]

    model_config = {"from_attributes": True}


class OperationNoteUpdate(BaseModel):
    note: Optional[str] = None


class StaffOut(BaseModel):
    id:          int
    name:        Optional[str]
    surname:     Optional[str]
    role:        Optional[str]
    status_label:      Optional[str]
    photo:       Optional[str]
    phone:       Optional[str]
    radio:       Optional[int]
    birthday:    Optional[date]
    start:       Optional[date]
    license:     Optional[int]
    license_exp: Optional[date]
    medical:     Optional[date]
    medical_exp: Optional[date]
    address:     Optional[str]
    weekend_shift: Optional[str]
    week_shift:    Optional[str]

    model_config = {"from_attributes": True}

class StaffUpdate(BaseModel):
    medical: date
    license_exp: date
    
    @model_validator(mode='after')
    def check_dates(self):
        today = date.today()
        if self.medical > today:
            raise ValueError("La data della visita medica non può essere nel futuro")
        if self.license_exp <= today:
            raise ValueError("La scadenza della licenza deve essere nel futuro")
        return self

class VehicleOut(BaseModel):
    plate:        str
    name:         Optional[str]
    brand:        Optional[str]
    model:        Optional[str]
    type:         Optional[str]
    status_label:  Optional[str]
    photo:        Optional[str]
    weight:       Optional[int]
    description:   Optional[str]
    data_reg:     Optional[date]
    data_acquire: Optional[date]
    seats:        Optional[int]
    limitations:   Optional[str]

    model_config = {"from_attributes": True}


class OperationDetailOut(OperationOut):
    """Single operation enriched with its vehicle dispatches."""
    starts: list[StartOut] = []