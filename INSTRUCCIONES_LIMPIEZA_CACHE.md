# Instrucciones para Limpiar Caché del Navegador

## Problema
Los cambios en el código no se reflejan en el navegador porque tiene caché antigua.

## Solución

### Opción 1: Hard Refresh (Recomendado)
1. Abre el navegador en `http://localhost:4200`
2. Presiona **Ctrl + Shift + R** (Windows/Linux) o **Cmd + Shift + R** (Mac)
3. Esto forzará la recarga sin usar caché

### Opción 2: Limpiar Caché Completa
1. Abre DevTools (F12)
2. Click derecho en el botón de recargar
3. Selecciona "Vaciar caché y volver a cargar de manera forzada"

### Opción 3: Modo Incógnito
1. Abre una ventana de incógnito (Ctrl + Shift + N)
2. Navega a `http://localhost:4200`
3. Inicia sesión nuevamente

## Verificar que los cambios se aplicaron

### En la Consola del Navegador (F12 > Console)
Deberías ver estos logs cuando navegas al perfil:
```
Datos del usuario recibidos: {id: 1, nombres: "...", imagen: "/uploads/..."}
Publicaciones del usuario: [...]
```

### En la Vista
- **Imagen de perfil**: Debe mostrar la foto real, no las iniciales
- **Mis Publicaciones**: Debe mostrar spinner "Cargando publicaciones..." y luego las publicaciones
- **Dashboard**: Debe cargar inmediatamente sin pantalla en blanco

## Si aún no funciona

1. Verifica que ambos servicios estén corriendo:
   - Backend: http://localhost:3000
   - Frontend: http://localhost:4200

2. Revisa la consola del navegador (F12) para errores

3. Verifica que el archivo TypeScript tenga los cambios:
   - Busca `cargarPublicacionesInterno` en `perfil.component.ts`
   - Busca `isLoadingPublicaciones` en el componente
