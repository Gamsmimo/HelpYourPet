# Cómo Verificar los Logs de Debugging

## ✅ Servicios Corriendo
- **Backend**: http://localhost:3000 ✅
- **Frontend**: http://localhost:4200 ✅

## 📋 Pasos para Verificar los Logs

### 1. Abrir DevTools
1. Abre el navegador en `http://localhost:4200`
2. Presiona **F12** para abrir las herramientas de desarrollador
3. Ve a la pestaña **Console**

### 2. Limpiar Caché (MUY IMPORTANTE)
**ANTES de navegar al perfil, limpia la caché:**
- Presiona **Ctrl + Shift + R** (Windows) o **Cmd + Shift + R** (Mac)
- O click derecho en el botón recargar > "Vaciar caché y volver a cargar de manera forzada"

### 3. Navegar al Perfil
1. Inicia sesión si no lo has hecho
2. Click en "Perfil" en el menú

### 4. Revisar los Logs en la Consola

Deberías ver estos logs en orden:

#### ✅ Logs Esperados (Si funciona correctamente):

```
🔍 [PERFIL] Cargando datos del usuario con ID: 1
✅ [PERFIL] Datos del usuario recibidos: {id: 1, nombres: "Cristian David", imagen: "/uploads/profile-pictures/..."}
🖼️ [PERFIL] Imagen del usuario: /uploads/profile-pictures/c32955127f597c8710ec7cfde3e518ad7.jpg
📊 [PERFIL] Estado después de cargar usuario: {isLoadingUser: false, dataInitialized: true, ...}
📰 [PERFIL] Iniciando carga de publicaciones...
📰 [PUBLICACIONES] Cargando publicaciones para userId: 1
✅ [PUBLICACIONES] Datos recibidos del backend: [...]
📊 [PUBLICACIONES] Cantidad de publicaciones: X
✅ [PUBLICACIONES] Publicaciones procesadas: [...]
📊 [PUBLICACIONES] Estado final: {isLoadingPublicaciones: false, cantidadPublicaciones: X}
🖼️ [IMAGEN] getImageUrl llamado con: {imagen: "/uploads/profile-pictures/...", ...}
🖼️ [IMAGEN] Retornando imagen del usuario: http://localhost:3000/uploads/profile-pictures/...
```

#### ❌ Logs de Error (Si algo falla):

Si ves estos logs, hay un problema:

```
❌ [PERFIL] Error al cargar datos del usuario: ...
❌ [PUBLICACIONES] Error al cargar: ...
❌ [PUBLICACIONES] Detalles del error: ...
```

### 5. Verificar la Vista

#### Imagen de Perfil:
- **✅ Correcto**: Debe mostrar la foto real del usuario
- **❌ Incorrecto**: Muestra iniciales "CD" o imagen por defecto

#### Mis Publicaciones:
- **✅ Correcto**: Muestra spinner "Cargando publicaciones..." y luego las publicaciones
- **❌ Incorrecto**: Se queda en "Cargando publicaciones..." infinitamente

### 6. Verificar Peticiones HTTP

En DevTools, ve a la pestaña **Network**:

1. Busca la petición a `usuarios/1` (o el ID de tu usuario)
   - Status: 200 OK
   - Response debe incluir: `imagen: "/uploads/profile-pictures/..."`

2. Busca la petición a `publicaciones/usuario/1`
   - Status: 200 OK
   - Response debe ser un array con las publicaciones

### 7. Si Aún No Funciona

#### Opción A: Modo Incógnito
1. Abre una ventana de incógnito (Ctrl + Shift + N)
2. Ve a `http://localhost:4200`
3. Inicia sesión y navega al perfil
4. Revisa los logs en la consola

#### Opción B: Limpiar Caché Completa
1. En Chrome: Settings > Privacy > Clear browsing data
2. Selecciona "Cached images and files"
3. Click "Clear data"
4. Recarga la página

## 📸 Captura de Pantalla de los Logs

Si los problemas persisten, toma una captura de pantalla de:
1. La consola completa (F12 > Console)
2. La pestaña Network mostrando las peticiones
3. La vista del perfil

Esto ayudará a identificar el problema exacto.

## 🔍 Verificar que los Cambios se Aplicaron

El archivo `perfil.component.ts` debe tener:
- Método `cargarDatosUsuarioYPublicaciones(userId: number)`
- Método `cargarPublicacionesInterno(userId: number)`
- Logs con emojis (🔍, ✅, ❌, etc.)

Si no ves estos logs en la consola, significa que el navegador está usando código en caché.
