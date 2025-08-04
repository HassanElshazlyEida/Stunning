#!/bin/bash

echo "========================================"
echo "  Website Idea Generator - Docker Setup"
echo "========================================"
echo

echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed or not in PATH"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "ERROR: Docker Compose is not installed or not in PATH"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

echo "Docker found! Starting setup..."
echo

echo "Building Docker images..."
docker-compose build

echo
echo "Starting all services..."
docker-compose up -d

echo
echo "Waiting for services to start..."
sleep 10

echo
echo "Checking service status..."
docker-compose ps

echo
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo
echo "Your application is now running at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo "  MongoDB:  localhost:27017"
echo
echo "To view logs: docker-compose logs -f"
echo "To stop:      docker-compose down"
echo
echo "Opening application in browser..."

# Try to open browser on different platforms
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
    open http://localhost:3000
else
    echo "Please open http://localhost:3000 in your browser"
fi
