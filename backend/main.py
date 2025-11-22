from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import List
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.models import (
    Transaction, TransactionCreate, TransactionUpdate,
    User, UserCreate,
    SavingsGoal, SavingsGoalCreate, SavingsGoalUpdate
)
from backend.database import db

app = FastAPI(title="Profit API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User Endpoints
@app.post("/api/users", response_model=User)
def create_or_get_user(user: UserCreate):
    """Create user if doesn't exist, or return existing user"""
    try:
        result = db.create_user(user.username)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Transaction Endpoints
@app.get("/api/transactions", response_model=List[Transaction])
def get_transactions(user_id: int):
    """Get all transactions for a user"""
    try:
        return db.get_transactions(user_id=user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/transactions", response_model=Transaction)
def create_transaction(transaction: TransactionCreate):
    try:
        data = transaction.model_dump(mode='json')
        print(f"Creating transaction: {data}")
        result = db.create_transaction(data)
        print(f"Transaction created: {result}")
        return result
    except Exception as e:
        print(f"Error creating transaction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/transactions/{uid}", response_model=Transaction)
def update_transaction(uid: int, transaction: TransactionUpdate):
    try:
        update_data = {k: v for k, v in transaction.model_dump(mode='json').items() if v is not None}
        print(f"Updating transaction {uid} with: {update_data}")
        if not update_data:
            raise HTTPException(status_code=400, detail="No data to update")
        result = db.update_transaction(uid, update_data)
        print(f"Transaction updated: {result}")
        return result
    except Exception as e:
        print(f"Error updating transaction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/transactions/{uid}")
def delete_transaction(uid: int):
    try:
        db.delete_transaction(uid)
        return {"message": "Transaction deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Savings Goals Endpoints
@app.get("/api/goals", response_model=List[SavingsGoal])
def get_goals(user_id: int):
    """Get all savings goals for a user"""
    try:
        return db.get_goals(user_id=user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/goals", response_model=SavingsGoal)
def create_goal(goal: SavingsGoalCreate):
    try:
        data = goal.model_dump(mode='json')
        result = db.create_goal(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/goals/{goal_id}", response_model=SavingsGoal)
def update_goal(goal_id: int, goal: SavingsGoalUpdate):
    try:
        update_data = {k: v for k, v in goal.model_dump(mode='json').items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No data to update")
        result = db.update_goal(goal_id, update_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/goals/{goal_id}")
def delete_goal(goal_id: int):
    try:
        db.delete_goal(goal_id)
        return {"message": "Goal deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Serve Static Files (Frontend)
if getattr(sys, 'frozen', False):
    base_dir = sys._MEIPASS
else:
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

static_dir = os.path.join(base_dir, "frontend", "dist")

if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
else:
    print(f"Warning: Static directory not found at {static_dir}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
