@echo off
echo Starting Procurement & Inventory Management System...
echo.

echo Setting up backend...
cd backend
call npm install
echo.

echo Running database migrations...
call npm run migrate
echo.

echo Seeding initial data...
call npm run seed
echo.

echo Starting backend server...
start "Backend Server" cmd /k "npm run dev"
echo.

echo Setting up frontend...
cd ..\frontend
call npm install
echo.

echo Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev"
echo.

echo Both servers are starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul