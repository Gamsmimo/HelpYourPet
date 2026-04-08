# Script para verificar todos los endpoints de la API
# Ejecutar: .\test-endpoints.ps1

$baseUrl = "http://localhost:3000"
$results = @()

Write-Host "=== VERIFICACIÓN DE ENDPOINTS ===" -ForegroundColor Cyan
Write-Host ""

# Función para probar endpoint
function Test-Endpoint {
    param($method, $url, $name)
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method $method -UseBasicParsing -ErrorAction Stop
        $status = $response.StatusCode
        $color = "Green"
        $result = "✓ OK"
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($status -eq 401 -or $status -eq 403) {
            $color = "Yellow"
            $result = "⚠ AUTH REQUIRED"
        } else {
            $color = "Red"
            $result = "✗ ERROR"
        }
    }
    
    Write-Host "$result [$status] $method $url" -ForegroundColor $color
    return @{Name=$name; Method=$method; URL=$url; Status=$status; Result=$result}
}

# 1. HEALTH & MONITORING
Write-Host "`n--- HEALTH & MONITORING ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/health" "Health Check"
$results += Test-Endpoint "GET" "$baseUrl/health/live" "Health Live"
$results += Test-Endpoint "GET" "$baseUrl/health/metrics" "Health Metrics"

# 2. AUTH
Write-Host "`n--- AUTH ---" -ForegroundColor Yellow
$results += Test-Endpoint "POST" "$baseUrl/auth/register" "Register"
$results += Test-Endpoint "POST" "$baseUrl/auth/login" "Login"

# 3. USUARIOS
Write-Host "`n--- USUARIOS ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/usuarios" "Get All Users"
$results += Test-Endpoint "POST" "$baseUrl/usuarios" "Create User"

# 4. ROLES
Write-Host "`n--- ROLES ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/roles" "Get All Roles"
$results += Test-Endpoint "POST" "$baseUrl/roles" "Create Role"

# 5. MASCOTAS
Write-Host "`n--- MASCOTAS ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/mascotas" "Get All Mascotas"
$results += Test-Endpoint "POST" "$baseUrl/mascotas" "Create Mascota"

# 6. ADOPCION
Write-Host "`n--- ADOPCION ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/adopcion" "Get All Adopciones"
$results += Test-Endpoint "POST" "$baseUrl/adopcion" "Create Adopcion"

# 7. VETERINARIAS
Write-Host "`n--- VETERINARIAS ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/veterinarias" "Get All Veterinarias"
$results += Test-Endpoint "POST" "$baseUrl/veterinarias" "Create Veterinaria"

# 8. CITAS
Write-Host "`n--- CITAS ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/citas" "Get All Citas"
$results += Test-Endpoint "POST" "$baseUrl/citas" "Create Cita"

# 9. PRODUCTOS
Write-Host "`n--- PRODUCTOS ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/productos" "Get All Productos"
$results += Test-Endpoint "POST" "$baseUrl/productos" "Create Producto"

# 10. CARRITO
Write-Host "`n--- CARRITO ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/carrito" "Get All Carritos"
$results += Test-Endpoint "POST" "$baseUrl/carrito" "Create Carrito"

# 11. VENTAS
Write-Host "`n--- VENTAS ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/ventas" "Get All Ventas"
$results += Test-Endpoint "POST" "$baseUrl/ventas" "Create Venta"

# 12. PAGOS
Write-Host "`n--- PAGOS ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/pagos" "Get All Pagos"
$results += Test-Endpoint "POST" "$baseUrl/pagos" "Create Pago"

# 13. SERVICIOS
Write-Host "`n--- SERVICIOS ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/servicios" "Get All Servicios"
$results += Test-Endpoint "POST" "$baseUrl/servicios" "Create Servicio"

# 14. CALIFICACIONES
Write-Host "`n--- CALIFICACIONES ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/calificaciones" "Get All Calificaciones"
$results += Test-Endpoint "POST" "$baseUrl/calificaciones" "Create Calificacion"

# 15. HISTORIAS CLINICAS
Write-Host "`n--- HISTORIAS CLINICAS ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/historias-clinicas" "Get All Historias"
$results += Test-Endpoint "POST" "$baseUrl/historias-clinicas" "Create Historia"

# 16. EMERGENCIAS
Write-Host "`n--- EMERGENCIAS ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/emergencias" "Get All Emergencias"
$results += Test-Endpoint "POST" "$baseUrl/emergencias" "Create Emergencia"

# 17. EVENTOS
Write-Host "`n--- EVENTOS ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/eventos" "Get All Eventos"
$results += Test-Endpoint "POST" "$baseUrl/eventos" "Create Evento"

# 18. NOTIFICACIONES
Write-Host "`n--- NOTIFICACIONES ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/notificaciones" "Get All Notificaciones"
$results += Test-Endpoint "POST" "$baseUrl/notificaciones" "Create Notificacion"

# 19. INVENTARIO
Write-Host "`n--- INVENTARIO ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/inventario" "Get All Inventario"
$results += Test-Endpoint "POST" "$baseUrl/inventario" "Create Inventario"

# 20. REPORTES MALTRATO
Write-Host "`n--- REPORTES MALTRATO ---" -ForegroundColor Yellow
$results += Test-Endpoint "GET" "$baseUrl/reportes-maltrato" "Get All Reportes"
$results += Test-Endpoint "POST" "$baseUrl/reportes-maltrato" "Create Reporte"

# RESUMEN
Write-Host "`n=== RESUMEN ===" -ForegroundColor Cyan
$total = $results.Count
$ok = ($results | Where-Object {$_.Result -eq "✓ OK"}).Count
$auth = ($results | Where-Object {$_.Result -eq "⚠ AUTH REQUIRED"}).Count
$error = ($results | Where-Object {$_.Result -eq "✗ ERROR"}).Count

Write-Host "Total endpoints probados: $total" -ForegroundColor White
Write-Host "✓ Funcionando: $ok" -ForegroundColor Green
Write-Host "⚠ Requieren autenticación: $auth" -ForegroundColor Yellow
Write-Host "✗ Con errores: $error" -ForegroundColor Red

# Guardar resultados
$results | Export-Csv -Path "endpoint-test-results.csv" -NoTypeInformation
Write-Host "`nResultados guardados en: endpoint-test-results.csv" -ForegroundColor Cyan
