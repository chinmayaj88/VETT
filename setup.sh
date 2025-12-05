#!/bin/bash

# Vett - One-Command Setup Script
# This script sets up the entire project with Docker

set -e

echo "🚀 Setting up Vett - Voice-Enabled Task Tracker"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://www.docker.com/get-started"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your API keys:"
    echo "   - DEEPGRAM_API_KEY"
    echo "   - GEMINI_API_KEY"
    echo "   - OPENAI_API_KEY"
    echo ""
    read -p "Press Enter to continue after adding your API keys..."
fi

echo "🐳 Starting Docker containers..."
echo ""

# Use docker compose (newer) or docker-compose (older)
if docker compose version &> /dev/null; then
    docker compose up --build -d
else
    docker-compose up --build -d
fi

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Services are running:"
echo "   🌐 Frontend:  http://localhost:5173"
echo "   🔧 Backend:   http://localhost:3000"
echo "   🗄️  Adminer:   http://localhost:8080"
echo ""
echo "📝 To view logs:"
echo "   docker compose logs -f"
echo ""
echo "🛑 To stop services:"
echo "   docker compose down"
echo ""
