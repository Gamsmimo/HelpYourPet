# Imágenes de Placeholder Requeridas

Para completar la implementación anti-flicker, necesitas agregar las siguientes imágenes en la carpeta `public/assets/img/`:

## Imágenes Requeridas:

1. **loading-avatar.png** - Imagen de placeholder mientras se carga el avatar del usuario
   - Tamaño recomendado: 200x200px
   - Puede ser un skeleton/shimmer o un ícono de carga
   - Alternativa: Usar un SVG inline o un data URL

2. **humano.jpg** - Imagen por defecto cuando el usuario no tiene foto de perfil
   - Ya debería existir según el código actual
   - Si no existe, crear una imagen genérica de avatar

## Alternativa sin archivos físicos:

Si prefieres no usar archivos de imagen, puedes modificar el código para usar:

### Opción 1: Data URL (SVG inline)
```typescript
getImageUrl(imagen: string | null | undefined): string {
  if (this.isLoadingUser && !imagen) {
    // SVG de loading spinner
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjMiLz48L3N2Zz4=';
  }
  // ... resto del código
}
```

### Opción 2: Usar UI Avatars API para placeholder
```typescript
getImageUrl(imagen: string | null | undefined): string {
  if (this.isLoadingUser && !imagen) {
    return 'https://ui-avatars.com/api/?name=Loading&background=e0e0e0&color=999';
  }
  // ... resto del código
}
```

## Ubicación de las imágenes:
- Crear carpeta: `public/assets/img/`
- Agregar las imágenes mencionadas
- El código ya está configurado para buscarlas en esa ruta
