# Vett - One-Command Setup Script (PowerShell)
# This script sets up the entire project with Docker

Write-Host "🚀 Setting up Vett - Voice-Enabled Task Tracker" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    docker --version | Out-Null
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
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
        Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
        exit 1
    }
}

# Check if .env file exists
if (-Not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  Please edit .env file and add your API keys:" -ForegroundColor Yellow
    Write-Host "   - DEEPGRAM_API_KEY" -ForegroundColor Yellow
    Write-Host "   - GEMINI_API_KEY" -ForegroundColor Yellow
    Write-Host "   - OPENAI_API_KEY" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to continue after adding your API keys"
}

Write-Host "🐳 Starting Docker containers..." -ForegroundColor Cyan
Write-Host ""

# Start Docker containers
Invoke-Expression "$composeCmd up --build -d"

Write-Host ""
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Services are running:" -ForegroundColor Cyan
Write-Host "   🌐 Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "   🔧 Backend:   http://localhost:3000" -ForegroundColor White
Write-Host "   🗄️  Adminer:   http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "📝 To view logs:" -ForegroundColor Cyan
Write-Host "   $composeCmd logs -f" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop services:" -ForegroundColor Cyan
Write-Host "   $composeCmd down" -ForegroundColor White
Write-Host ""
