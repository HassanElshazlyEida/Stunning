@echo off
echo ========================================
echo   Setting up Testing Environment
echo ========================================
echo.

echo Installing frontend testing dependencies...
cd frontend
call npm install
echo.

echo Installing Playwright browsers...
call npx playwright install
echo.

echo Installing backend testing dependencies...
cd ..\backend
call npm install
echo.

echo ========================================
echo   Running Tests
echo ========================================
echo.

echo Running frontend unit tests...
cd ..\frontend
call npm test -- --watchAll=false
echo.

echo Running backend unit tests...
cd ..\backend
call npm test
echo.

echo ========================================
echo   Test Setup Complete!
echo ========================================
echo.
echo To run tests individually:
echo   Frontend: cd frontend && npm test
echo   Backend:  cd backend && npm test
echo   E2E:      cd frontend && npm run test:e2e
echo.
pause
