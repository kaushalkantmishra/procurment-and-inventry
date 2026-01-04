@echo off
echo ========================================
echo  ProcureDesk - Full Stack Launcher
echo ========================================
echo.

REM Check if node_modules exists in root
if not exist "node_modules\" (
    echo [1/4] Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo.
) else (
    echo [1/4] Frontend dependencies already installed
    echo.
)

REM Check if backend node_modules exists
if not exist "backend\node_modules\" (
    echo [2/4] Installing backend dependencies...
    cd backend
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
    cd ..
    echo.
) else (
    echo [2/4] Backend dependencies already installed
    echo.
)

REM Check if backend .env exists
if not exist "backend\.env" (
    echo [3/4] Creating backend .env file...
    echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/procurement_db > backend\.env
    echo JWT_SECRET=your_jwt_secret_here >> backend\.env
    echo JWT_EXPIRES_IN=7d >> backend\.env
    echo NODE_ENV=development >> backend\.env
    echo PORT=3001 >> backend\.env
    echo FRONTEND_URL=http://localhost:5173 >> backend\.env
    echo CLOUDINARY_CLOUD_NAME=your_cloud_name >> backend\.env
    echo CLOUDINARY_API_KEY=your_api_key >> backend\.env
    echo CLOUDINARY_API_SECRET=your_api_secret >> backend\.env
    echo.
    echo WARNING: Please update backend\.env with your database and Cloudinary credentials
    echo.
) else (
    echo [3/4] Backend environment file exists
    echo.
)

echo [4/4] Starting full application...
echo.
echo Starting Backend API server and Frontend dev server...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo Press Ctrl+C to stop
echo.

call npm run dev:full
