@echo off
echo Starting Profit Web App...
echo.
echo 1. Starting Server...
echo 2. Opening Browser...
echo.
echo Keep this window open while using the app!
echo.

REM Open Browser after a short delay
start "" "http://localhost:8000"

REM Run Python Server
call c:\Users\samsa\Documents\Python\project_venv\Scripts\python.exe -m backend.main

pause
