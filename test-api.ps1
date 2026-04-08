# Script para verificar endpoints de la API
$baseUrl = "http://localhost:3000"

Write-Host "=== VERIFICACION DE ENDPOINTS ===" -ForegroundColor Cyan

# Health Check
Write-Host "`n--- HEALTH & MONITORING ---" -ForegroundColor Yellow
try { $r = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET -UseBasicParsing; Write-Host "OK [$($r.StatusCode)] GET /health" -ForegroundColor Green } catch { Write-Host "ERROR GET /health" -ForegroundColor Red }
try { $r = Invoke-WebRequest -Uri "$baseUrl/health/live" -Method GET -UseBasicParsing; Write-Host "OK [$($r.StatusCode)] GET /health/live" -ForegroundColor Green } catch { Write-Host "ERROR GET /health/live" -ForegroundColor Red }

# Auth
Write-Host "`n--- AUTH ---" -ForegroundColor Yellow
try { Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -UseBasicParsing -ErrorAction Stop | Out-Null; Write-Host "OK POST /auth/register" -ForegroundColor Green } catch { if ($_.Exception.Response.StatusCode.value__ -eq 400) { Write-Host "AUTH REQUIRED [400] POST /auth/register" -ForegroundColor Yellow } else { Write-Host "ERROR POST /auth/register" -ForegroundColor Red } }
try { Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -UseBasicParsing -ErrorAction Stop | Out-Null; Write-Host "OK POST /auth/login" -ForegroundColor Green } catch { if ($_.Exception.Response.StatusCode.value__ -eq 400) { Write-Host "AUTH REQUIRED [400] POST /auth/login" -ForegroundColor Yellow } else { Write-Host "ERROR POST /auth/login" -ForegroundColor Red } }

# Usuarios
Write-Host "`n--- USUARIOS ---" -ForegroundColor Yellow
try { Invoke-WebRequest -Uri "$baseUrl/usuarios" -Method GET -UseBasicParsing -ErrorAction Stop | Out-Null; Write-Host "OK GET /usuarios" -ForegroundColor Green } catch { if ($_.Exception.Response.StatusCode.value__ -eq 401) { Write-Host "AUTH REQUIRED [401] GET /usuarios" -ForegroundColor Yellow } else { Write-Host "ERROR GET /usuarios" -ForegroundColor Red } }

# Roles
Write-Host "`n--- ROLES ---" -ForegroundColor Yellow
try { Invoke-WebRequest -Uri "$baseUrl/roles" -Method GET -UseBasicParsing -ErrorAction Stop | Out-Null; Write-Host "OK GET /roles" -ForegroundColor Green } catch { if ($_.Exception.Response.StatusCode.value__ -eq 401) { Write-Host "AUTH REQUIRED [401] GET /roles" -ForegroundColor Yellow } else { Write-Host "ERROR GET /roles" -ForegroundColor Red } }

# Mascotas
Write-Host "`n--- MASCOTAS ---" -ForegroundColor Yellow
try { Invoke-WebRequest -Uri "$baseUrl/mascotas" -Method GET -UseBasicParsing -ErrorAction Stop | Out-Null; Write-Host "OK GET /mascotas" -ForegroundColor Green } catch { if ($_.Exception.Response.StatusCode.value__ -eq 401) { Write-Host "AUTH REQUIRED [401] GET /mascotas" -ForegroundColor Yellow } else { Write-Host "ERROR GET /mascotas" -ForegroundColor Red } }

# Adopcion
Write-Host "`n--- ADOPCION ---" -ForegroundColor Yellow
try { $r = Invoke-WebRequest -Uri "$baseUrl/adopcion" -Method GET -UseBasicParsing; Write-Host "OK [$($r.StatusCode)] GET /adopcion" -ForegroundColor Green } catch { Write-Host "ERROR GET /adopcion" -ForegroundColor Red }

# Veterinarias
Write-Host "`n--- VETERINARIAS ---" -ForegroundColor Yellow
try { $r = Invoke-WebRequest -Uri "$baseUrl/veterinarias" -Method GET -UseBasicParsing; Write-Host "OK [$($r.StatusCode)] GET /veterinarias" -ForegroundColor Green } catch { Write-Host "ERROR GET /veterinarias" -ForegroundColor Red }

# Citas
Write-Host "`n--- CITAS ---" -ForegroundColor Yellow
try { Invoke-WebRequest -Uri "$baseUrl/citas" -Method GET -UseBasicParsing -ErrorAction Stop | Out-Null; Write-Host "OK GET /citas" -ForegroundColor Green } catch { if ($_.Exception.Response.StatusCode.value__ -eq 401) { Write-Host "AUTH REQUIRED [401] GET /citas" -ForegroundColor Yellow } else { Write-Host "ERROR GET /citas" -ForegroundColor Red } }

# Productos
Write-Host "`n--- PRODUCTOS ---" -ForegroundColor Yellow
try { $r = Invoke-WebRequest -Uri "$baseUrl/productos" -Method GET -UseBasicParsing; Write-Host "OK [$($r.StatusCode)] GET /productos" -ForegroundColor Green } catch { Write-Host "ERROR GET /productos" -ForegroundColor Red }

# Servicios
Write-Host "`n--- SERVICIOS ---" -ForegroundColor Yellow
try { $r = Invoke-WebRequest -Uri "$baseUrl/servicios" -Method GET -UseBasicParsing; Write-Host "OK [$($r.StatusCode)] GET /servicios" -ForegroundColor Green } catch { Write-Host "ERROR GET /servicios" -ForegroundColor Red }

# Calificaciones
Write-Host "`n--- CALIFICACIONES ---" -ForegroundColor Yellow
try { Invoke-WebRequest -Uri "$baseUrl/calificaciones" -Method GET -UseBasicParsing -ErrorAction Stop | Out-Null; Write-Host "OK GET /calificaciones" -ForegroundColor Green } catch { if ($_.Exception.Response.StatusCode.value__ -eq 401) { Write-Host "AUTH REQUIRED [401] GET /calificaciones" -ForegroundColor Yellow } else { Write-Host "ERROR GET /calificaciones" -ForegroundColor Red } }

# Eventos
Write-Host "`n--- EVENTOS ---" -ForegroundColor Yellow
try { $r = Invoke-WebRequest -Uri "$baseUrl/eventos" -Method GET -UseBasicParsing; Write-Host "OK [$($r.StatusCode)] GET /eventos" -ForegroundColor Green } catch { Write-Host "ERROR GET /eventos" -ForegroundColor Red }

# Inventario
Write-Host "`n--- INVENTARIO ---" -ForegroundColor Yellow
try { Invoke-WebRequest -Uri "$baseUrl/inventario" -Method GET -UseBasicParsing -ErrorAction Stop | Out-Null; Write-Host "OK GET /inventario" -ForegroundColor Green } catch { if ($_.Exception.Response.StatusCode.value__ -eq 401) { Write-Host "AUTH REQUIRED [401] GET /inventario" -ForegroundColor Yellow } else { Write-Host "ERROR GET /inventario" -ForegroundColor Red } }

# Reportes Maltrato
Write-Host "`n--- REPORTES MALTRATO ---" -ForegroundColor Yellow
try { Invoke-WebRequest -Uri "$baseUrl/reportes-maltrato" -Method GET -UseBasicParsing -ErrorAction Stop | Out-Null; Write-Host "OK GET /reportes-maltrato" -ForegroundColor Green } catch { if ($_.Exception.Response.StatusCode.value__ -eq 401) { Write-Host "AUTH REQUIRED [401] GET /reportes-maltrato" -ForegroundColor Yellow } else { Write-Host "ERROR GET /reportes-maltrato" -ForegroundColor Red } }

Write-Host "`n=== VERIFICACION COMPLETADA ===" -ForegroundColor Cyan
