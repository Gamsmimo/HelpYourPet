@echo off
title Help Your Pet - Iniciar Todos los Servicios
color 0A

echo ========================================
echo   Help Your Pet - Iniciando Servicios
echo ========================================
echo.

:: Verificar si Docker está corriendo
echo [1/4] Verificando Docker...
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker no está corriendo. Por favor, inicia Docker Desktop primero.
    pause
    exit /b 1
)
echo Docker está corriendo.

:: Iniciar contenedores Docker
echo.
echo [2/4] Iniciando contenedores Docker (MySQL y Redis)...
docker-compose up -d
echo Contenedores iniciados.

:: Esperar a que la base de datos esté lista
echo.
echo [3/4] Esperando a que la base de datos esté lista...
timeout /t 10 /nobreak >nul

:: Iniciar Backend NestJS
echo.
echo [4/4] Iniciando Backend NestJS...
echo Abriendo nueva terminal para Backend...
start "Backend NestJS" cmd /k "cd /d %~dp0 && echo Backend NestJS iniciado && echo Esperando a que inicie... && timeout /t 5 /nobreak >nul && npm run start:dev"

:: Esperar a que el backend inicie
echo.
echo Esperando a que el backend inicie completamente...
timeout /t 15 /nobreak >nul

:: Iniciar Frontend Angular
echo.
echo Iniciando Frontend Angular...
echo Abriendo nueva terminal para Frontend...
start "Frontend Angular" cmd /k "cd /d %~dp0\frontend-angular && echo Frontend Angular iniciado && npm start"

:: Abrir navegador
echo.
echo Abriendo navegador en 10 segundos...
timeout /t 10 /nobreak >nul
start http://localhost:4200

echo.
echo ========================================
echo   ¡TODOS LOS SERVICIOS INICIADOS!
echo ========================================
echo.
echo Frontend: http://localhost:4200
echo Backend API: http://localhost:3000
echo Swagger: http://localhost:3000/api
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
