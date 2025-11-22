from pydantic import BaseModel
from typing import Optional, Literal
from datetime import date

# User Models
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

# Transaction Models
class TransactionBase(BaseModel):
    fecha: date
    concepto: str
    monto: float
    moneda: Literal["NIO", "USD"]
    tipo: Literal["Gasto", "Ingreso"]

class TransactionCreate(TransactionBase):
    user_id: int

class TransactionUpdate(BaseModel):
    fecha: Optional[date] = None
    concepto: Optional[str] = None
    monto: Optional[float] = None
    moneda: Optional[Literal["Córdobas", "Dólares"]] = None
    tipo: Optional[Literal["Gasto", "Ingreso"]] = None

class Transaction(TransactionBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

# Savings Goal Models
class SavingsGoalBase(BaseModel):
    nombre: str
    monto_objetivo: float
    monto_actual: float = 0
    fecha_inicio: date
    fecha_objetivo: date
    descripcion: Optional[str] = None

class SavingsGoalCreate(SavingsGoalBase):
    user_id: int

class SavingsGoalUpdate(BaseModel):
    nombre: Optional[str] = None
    monto_objetivo: Optional[float] = None
    monto_actual: Optional[float] = None
    fecha_inicio: Optional[date] = None
    fecha_objetivo: Optional[date] = None
    descripcion: Optional[str] = None

class SavingsGoal(SavingsGoalBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True
