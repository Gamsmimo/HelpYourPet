# Help Your Pet - Script para iniciar todos los servicios

Write-Host "========================================" -ForegroundColor Green
Write-Host "  Help Your Pet - Iniciando Servicios" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# 1. Verificar Docker
Write-Host "[1/4] Verificando Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "Docker está corriendo." -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker no está corriendo. Por favor, inicia Docker Desktop primero." -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# 2. Iniciar contenedores Docker
Write-Host ""
Write-Host "[2/4] Iniciando contenedores Docker (MySQL y Redis)..." -ForegroundColor Yellow
docker-compose up -d
Write-Host "Contenedores iniciados." -ForegroundColor Green

# 3. Esperar a la base de datos
Write-Host ""
Write-Host "[3/4] Esperando a que la base de datos esté lista..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 4. Iniciar Backend
Write-Host ""
Write-Host "[4/4] Iniciando Backend NestJS..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host 'Backend NestJS iniciado' -ForegroundColor Cyan; Write-Host 'Esperando a que inicie...' -ForegroundColor Yellow; Start-Sleep -Seconds 5; npm run start:dev"

# 5. Esperar al backend
Write-Host ""
Write-Host "Esperando a que el backend inicie completamente..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# 6. Iniciar Frontend
Write-Host ""
Write-Host "Iniciando Frontend Angular..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\frontend-angular"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend-angular'; Write-Host 'Frontend Angular iniciado' -ForegroundColor Cyan; npm start"

# 7. Abrir navegador
Write-Host ""
Write-Host "Abriendo navegador en 10 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
Start-Process "http://localhost:4200"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ¡TODOS LOS SERVICIOS INICIADOS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Swagger: http://localhost:3000/api" -ForegroundColor Cyan
Write-Host "phpMyAdmin: http://localhost:8081" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
