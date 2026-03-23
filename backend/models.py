from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from database import Base


class Operation(Base):
    __tablename__ = "Operations"

    id          = Column("ID",       Integer,      primary_key=True)
    year        = Column("year",     String(4),    primary_key=True)
    opn         = Column("opn",      String(255))
    date        = Column("date",     Date)
    dt_exit     = Column("dt_exit",  DateTime)
    dt_close    = Column("dt_close", DateTime)
    typology    = Column("typology", String(500))
    x           = Column("x",        String(255))
    y           = Column("y",        String(255))
    loc         = Column("loc",      String(255))
    boss        = Column("boss",     String(255))


class Start(Base):
    __tablename__ = "Starts"

    op_id       = Column("OpID",       Integer,   primary_key=True)
    id          = Column("ID",         Integer,   primary_key=True)
    year        = Column("year",       String(4), primary_key=True)
    vehicle     = Column("vehicle",    String(255))
    exit_dt     = Column("exit_dt",    DateTime)
    inplace_dt  = Column("inplace_dt", DateTime)
    back_dt     = Column("back_dt",    DateTime)
    boss        = Column("boss",       String(255))