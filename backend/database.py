from supabase import create_client, Client
import os
from typing import List, Dict, Any

# HARDCODED CREDENTIALS (AS REQUESTED BY USER CONTEXT)
# In a production env, these should be in .env
SUPABASE_URL = "https://ftotasisodpjxcnyioux.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0b3Rhc2lzb2Rwanhjbnlpb3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3OTQyMjYsImV4cCI6MjA3OTM3MDIyNn0.qMslAGiXDmn6zPA88yp_E9Q8An-qNsG9ilvmXjF31Kk"

class DatabaseHandler:
    def __init__(self):
        self.client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.table = "transacciones"

    def get_transactions(self, limit: int = 50) -> List[Dict[str, Any]]:
        response = self.client.table(self.table).select("*").order("fecha", desc=True).limit(limit).execute()
        return response.data

    def create_transaction(self, data: Dict[str, Any]) -> Dict[str, Any]:
        response = self.client.table(self.table).insert(data).execute()
        return response.data[0] if response.data else {}

    def update_transaction(self, uid: int, data: Dict[str, Any]) -> Dict[str, Any]:
        response = self.client.table(self.table).update(data).eq("id", uid).execute()
        return response.data[0] if response.data else {}

    def delete_transaction(self, uid: int):
        self.client.table(self.table).delete().eq("id", uid).execute()

db = DatabaseHandler()
