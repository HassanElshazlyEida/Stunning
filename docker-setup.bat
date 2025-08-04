@echo off
echo ========================================
echo   Website Idea Generator - Docker Setup
echo ========================================
echo.

echo Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Docker found! Starting setup...
echo.

echo Building Docker images...
docker-compose build

echo.
echo Starting all services...
docker-compose up -d

echo.
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo Checking service status...
docker-compose ps

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Your application is now running at:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:3001
echo   MongoDB:  localhost:27017
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo.
echo Press any key to open the application in your browser...
pause >nul

start http://localhost:3000
