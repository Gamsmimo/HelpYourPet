# Help Your Pet - Script para detener todos los servicios

Write-Host "========================================" -ForegroundColor Red
Write-Host "  Help Your Pet - Deteniendo Servicios" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

# 1. Detener contenedores Docker
Write-Host "[1/3] Deteniendo contenedores Docker..." -ForegroundColor Yellow
docker-compose down
Write-Host "Contenedores Docker detenidos." -ForegroundColor Green

# 2. Matar procesos Node.js (Backend y Frontend)
Write-Host ""
Write-Host "[2/3] Deteniendo procesos Node.js..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
if ($?) {
    Write-Host "Procesos Node.js detenidos." -ForegroundColor Green
} else {
    Write-Host "No se encontraron procesos Node.js corriendo." -ForegroundColor Yellow
}

# 3. Limpiar puertos
Write-Host ""
Write-Host "[3/3] Verificando que los puertos estén libres..." -ForegroundColor Yellow

# Verificar puerto 3000 (Backend)
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "El puerto 3000 todavía está en uso." -ForegroundColor Red
} else {
    Write-Host "Puerto 3000 está libre." -ForegroundColor Green
}

# Verificar puerto 4200 (Frontend)
$port4200 = Get-NetTCPConnection -LocalPort 4200 -ErrorAction SilentlyContinue
if ($port4200) {
    Write-Host "El puerto 4200 todavía está en uso." -ForegroundColor Red
} else {
    Write-Host "Puerto 4200 está libre." -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ¡TODOS LOS SERVICIOS DETENIDOS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Los servicios han sido detenidos:" -ForegroundColor Cyan
Write-Host "- Docker (MySQL, Redis, phpMyAdmin)" -ForegroundColor Cyan
Write-Host "- Backend NestJS" -ForegroundColor Cyan
Write-Host "- Frontend Angular" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
