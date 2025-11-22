from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import List
import os
import sys
from .models import Transaction, TransactionCreate, TransactionUpdate
from .database import db

app = FastAPI(title="Profit API")

# Allow CORS for frontend (useful for dev, harmless in prod if local)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Endpoints
@app.get("/api/transactions", response_model=List[Transaction])
def get_transactions(usuario: str = None):
    try:
        return db.get_transactions(usuario=usuario)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/transactions", response_model=Transaction)
def create_transaction(transaction: TransactionCreate):
    try:
        # mode='json' converts dates to ISO strings, which Supabase expects
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
        # Filter out None values
        # mode='json' handles date serialization
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

# Serve Static Files (Frontend)
# Determine path to dist folder (works for dev and PyInstaller)
if getattr(sys, 'frozen', False):
    # If running as compiled exe
    base_dir = sys._MEIPASS
else:
    # If running as script
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

static_dir = os.path.join(base_dir, "frontend", "dist")

if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
else:
    print(f"Warning: Static directory not found at {static_dir}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
