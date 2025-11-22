@echo off
echo Building Profit Standalone App...

REM Clean previous builds
rmdir /s /q build
rmdir /s /q dist

REM Run PyInstaller using python module to ensure correct env
python -m PyInstaller --noconfirm --onefile --windowed --name "Profit" ^
    --add-data "frontend/dist;frontend/dist" ^
    --hidden-import "uvicorn.logging" ^
    --hidden-import "uvicorn.loops" ^
    --hidden-import "uvicorn.loops.auto" ^
    --hidden-import "uvicorn.protocols" ^
    --hidden-import "uvicorn.protocols.http" ^
    --hidden-import "uvicorn.protocols.http.auto" ^
    --hidden-import "uvicorn.lifespan" ^
    --hidden-import "uvicorn.lifespan.on" ^
    --hidden-import "fastapi" ^
    --hidden-import "starlette" ^
    --hidden-import "pydantic" ^
    desktop_app.py

echo.
echo Build complete! Executable is in the 'dist' folder.
pause
