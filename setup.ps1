# Vett - One-Command Setup Script (PowerShell)
# This script sets up the entire project with Docker

Write-Host "Setting up Vett - Voice-Enabled Task Tracker" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    docker --version | Out-Null
} catch {
    Write-Host "[ERROR] Docker is not installed. Please install Docker first." -ForegroundColor Red
    Write-Host "   Visit: https://www.docker.com/get-started" -ForegroundColor Yellow
    exit 1
}

# Check if Docker Compose is available
try {
    docker compose version | Out-Null
    $composeCmd = "docker compose"
} catch {
    try {
        docker-compose --version | Out-Null
        $composeCmd = "docker-compose"
    } catch {
        Write-Host "[ERROR] Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
        exit 1
    }
}

# Check if .env file exists
if (-Not (Test-Path .env)) {
    if (Test-Path .env.example) {
        Write-Host "[INFO] Creating .env file from .env.example..." -ForegroundColor Yellow
        Copy-Item .env.example .env
    } else {
        Write-Host "[INFO] Creating .env file..." -ForegroundColor Yellow
        @"
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=vett
POSTGRES_PORT=5432

# API Keys (Required)
DEEPGRAM_API_KEY=your_deepgram_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
NODE_ENV=production
BACKEND_PORT=3000
FRONTEND_PORT=5173

# Frontend Configuration
VITE_API_URL=http://localhost:3000/api
"@ | Out-File -FilePath .env -Encoding utf8
    }
    Write-Host "[WARNING] Please edit .env file and add your API keys:" -ForegroundColor Yellow
    Write-Host "   - DEEPGRAM_API_KEY" -ForegroundColor Yellow
    Write-Host "   - GEMINI_API_KEY" -ForegroundColor Yellow
    Write-Host "   - OPENAI_API_KEY" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to continue after adding your API keys"
}

Write-Host "[INFO] Starting Docker containers..." -ForegroundColor Cyan
Write-Host ""

# Start Docker containers
Invoke-Expression "$composeCmd up --build -d"

Write-Host ""
Write-Host "[INFO] Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "[SUCCESS] Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Services are running:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:   http://localhost:3000" -ForegroundColor White
Write-Host "   Adminer:   http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Cyan
Write-Host "   $composeCmd logs -f" -ForegroundColor White
Write-Host ""
Write-Host "To stop services:" -ForegroundColor Cyan
Write-Host "   $composeCmd down" -ForegroundColor White
Write-Host ""
