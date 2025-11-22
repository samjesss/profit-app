import webview
import threading
import uvicorn
import sys
import os
from backend.main import app

def start_server():
    # Run FastAPI server
    # log_level="error" to reduce noise
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="error")

def main():
    # Start server in a separate thread
    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()

    # Create window
    webview.create_window("Profit", "http://127.0.0.1:8000", width=1200, height=800, resizable=True)
    
    # Start webview
    try:
        webview.start()
    except Exception as e:
        print(f"Error starting webview: {e}")
        import webbrowser
        webbrowser.open("http://127.0.0.1:8000")
        import time
        while True:
            time.sleep(1)

if __name__ == "__main__":
    main()
