from supabase import create_client, Client
import os
from typing import List, Dict, Any, Optional

# Load credentials from environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")

class DatabaseHandler:
    def __init__(self):
        self.client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.transactions_table = "transacciones"
        self.users_table = "usuarios"
        self.goals_table = "metas_ahorro"

    # User methods
    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        response = self.client.table(self.users_table).select("*").eq("username", username).execute()
        return response.data[0] if response.data else None

    def create_user(self, username: str) -> Dict[str, Any]:
        # Check if user exists
        existing = self.get_user_by_username(username)
        if existing:
            return existing
        
        try:
            # Create new user
            response = self.client.table(self.users_table).insert({"username": username}).execute()
            return response.data[0] if response.data else {}
        except Exception as e:
            # If insertion fails (likely unique constraint), try to fetch again
            # This handles race conditions or check failures
            print(f"Error creating user (possible duplicate): {e}")
            existing = self.get_user_by_username(username)
            if existing:
                return existing
            # If still not found, raise the original error
            raise e

    # Transaction methods
    def get_transactions(self, user_id: int = None, limit: int = 50) -> List[Dict[str, Any]]:
        query = self.client.table(self.transactions_table).select("*")
        if user_id:
            query = query.eq("user_id", user_id)
        response = query.order("fecha", desc=True).limit(limit).execute()
        return response.data

    def create_transaction(self, data: Dict[str, Any]) -> Dict[str, Any]:
        response = self.client.table(self.transactions_table).insert(data).execute()
        return response.data[0] if response.data else {}

    def update_transaction(self, uid: int, data: Dict[str, Any]) -> Dict[str, Any]:
        response = self.client.table(self.transactions_table).update(data).eq("id", uid).execute()
        return response.data[0] if response.data else {}

    def delete_transaction(self, uid: int):
        self.client.table(self.transactions_table).delete().eq("id", uid).execute()

    # Savings goals methods
    def get_goals(self, user_id: int) -> List[Dict[str, Any]]:
        response = self.client.table(self.goals_table).select("*").eq("user_id", user_id).order("created_at", desc=False).execute()
        return response.data

    def create_goal(self, data: Dict[str, Any]) -> Dict[str, Any]:
        response = self.client.table(self.goals_table).insert(data).execute()
        return response.data[0] if response.data else {}

    def update_goal(self, goal_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
        response = self.client.table(self.goals_table).update(data).eq("id", goal_id).execute()
        return response.data[0] if response.data else {}

    def delete_goal(self, goal_id: int):
        self.client.table(self.goals_table).delete().eq("id", goal_id).execute()

db = DatabaseHandler()
