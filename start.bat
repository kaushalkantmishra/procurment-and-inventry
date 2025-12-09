@echo off
echo ========================================
echo  ProcureDesk - Electron App Launcher
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [1/3] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
) else (
    echo [1/3] Dependencies already installed
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo [2/3] Creating .env file...
    echo DATABASE_URL=postgresql://username:password@localhost:5432/procurement_db > .env
    echo JWT_SECRET=your-secret-key-change-in-production >> .env
    echo JWT_EXPIRES_IN=7d >> .env
    echo NODE_ENV=development >> .env
    echo.
    echo WARNING: Please update .env with your database credentials
    echo.
) else (
    echo [2/3] Environment file exists
    echo.
)

echo [3/3] Starting application...
echo.
echo Starting Vite dev server and Electron...
echo Press Ctrl+C to stop
echo.

call npm run dev
