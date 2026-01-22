# Blockchain Proof System - Quick Start

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Blockchain Proof System Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "✅ MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️ MongoDB is not running" -ForegroundColor Red
        Write-Host "Starting MongoDB..." -ForegroundColor Yellow
        
        # Try to start MongoDB service
        try {
            Start-Service MongoDB -ErrorAction SilentlyContinue
            Write-Host "✅ MongoDB service started" -ForegroundColor Green
        } catch {
            Write-Host "❌ Could not start MongoDB service" -ForegroundColor Red
            Write-Host "Please install MongoDB or start it manually" -ForegroundColor Yellow
            Write-Host "Docker alternative: docker run -d -p 27017:27017 mongo" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "⚠️ MongoDB check failed" -ForegroundColor Red
}

Write-Host ""

# Check if Ganache is running
Write-Host "Checking Ganache..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8545" -Method POST -Body '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' -ContentType "application/json" -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Ganache is running on port 8545" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Ganache is not running" -ForegroundColor Red
    Write-Host "Please start Ganache GUI or ganache-cli" -ForegroundColor Yellow
}

Write-Host ""

# Check Python dependencies
Write-Host "Checking Python dependencies..." -ForegroundColor Yellow
cd project\BlockchainFraud

$packages = @("flask", "flask-cors", "pandas", "numpy", "sklearn", "web3", "pymongo")
$missing = @()

foreach ($package in $packages) {
    try {
        $result = python -c "import $package" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $package installed" -ForegroundColor Green
        } else {
            $missing += $package
            Write-Host "❌ $package missing" -ForegroundColor Red
        }
    } catch {
        $missing += $package
        Write-Host "❌ $package missing" -ForegroundColor Red
    }
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "Installing missing packages..." -ForegroundColor Yellow
    pip install pymongo
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Setup Status Summary" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Ensure MongoDB is running" -ForegroundColor White
Write-Host "2. Ensure Ganache is running" -ForegroundColor White
Write-Host "3. Start backend: python app.py" -ForegroundColor White
Write-Host "4. Start frontend: cd ../../Frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Documentation: BLOCKCHAIN_PROOF_IMPLEMENTATION.md" -ForegroundColor Cyan
Write-Host ""
