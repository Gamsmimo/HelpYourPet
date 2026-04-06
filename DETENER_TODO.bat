@echo off
title Help Your Pet - Detener Todos los Servicios
color 0C

echo ========================================
echo   Help Your Pet - Deteniendo Servicios
echo ========================================
echo.

echo [1/3] Deteniendo contenedores Docker...
docker-compose down
echo Contenedores Docker detenidos.

echo.
echo [2/3] Deteniendo procesos Node.js...
taskkill /F /IM node.exe >nul 2>&1
if errorlevel 1 (
    echo No se encontraron procesos Node.js corriendo.
) else (
    echo Procesos Node.js detenidos.
)

echo.
echo [3/3] Verificando puertos...
netstat -an | findstr :3000 >nul
if errorlevel 1 (
    echo Puerto 3000 esta libre.
) else (
    echo Puerto 3000 todavia esta en uso.
)

netstat -an | findstr :4200 >nul
if errorlevel 1 (
    echo Puerto 4200 esta libre.
) else (
    echo Puerto 4200 todavia esta en uso.
)

echo.
echo ========================================
echo   ¡TODOS LOS SERVICIOS DETENIDOS!
echo ========================================
echo.
echo Los servicios han sido detenidos:
echo - Docker (MySQL, Redis, phpMyAdmin)
echo - Backend NestJS
echo - Frontend Angular
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
