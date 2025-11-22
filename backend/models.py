from pydantic import BaseModel
from datetime import date
from typing import Optional, Literal

class TransactionBase(BaseModel):
    fecha: date
    usuario: str
    concepto: str
    monto: float
    moneda: Literal["NIO", "USD"]
    tipo: Literal["Gasto", "Ingreso"]

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    fecha: Optional[date] = None
    usuario: Optional[str] = None
    concepto: Optional[str] = None
    monto: Optional[float] = None
    moneda: Optional[Literal["NIO", "USD"]] = None
    tipo: Optional[Literal["Gasto", "Ingreso"]] = None

class Transaction(TransactionBase):
    id: int

    class Config:
        from_attributes = True
