#!/bin/bash

echo "========================================"
echo "  Setting up Testing Environment"
echo "========================================"
echo

echo "Installing frontend testing dependencies..."
cd frontend
npm install
echo

echo "Installing Playwright browsers..."
npx playwright install
echo

echo "Installing backend testing dependencies..."
cd ../backend
npm install
echo

echo "========================================"
echo "  Running Tests"
echo "========================================"
echo

echo "Running frontend unit tests..."
cd ../frontend
npm test -- --watchAll=false
echo

echo "Running backend unit tests..."
cd ../backend
npm test
echo

echo "========================================"
echo "  Test Setup Complete!"
echo "========================================"
echo
echo "To run tests individually:"
echo "  Frontend: cd frontend && npm test"
echo "  Backend:  cd backend && npm test"
echo "  E2E:      cd frontend && npm run test:e2e"
echo
