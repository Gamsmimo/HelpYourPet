# Migración de Perfil Usuario - Thymeleaf a Angular

## Estructura identificada del HTML Thymeleaf:

### Secciones principales:
1. **Dashboard** - Vista inicial con resumen
2. **Mis Mascotas** - Lista y gestión de mascotas
3. **Historia Clínica** - Historial médico por mascota
4. **Mis Compras** - Historial de compras
5. **Citas Veterinarias** - Gestión de citas
6. **Mis Adopciones** - Mascotas en adopción
7. **Configuración** - Perfil y seguridad

### Modales necesarios:
- Modal agregar mascota
- Modal editar mascota
- Modal detalles de compra
- Modal detalles de cita

### Funcionalidades clave:
- Cambio de foto de perfil con preview
- Tema claro/oscuro
- Sidebar responsive con overlay
- Botón hamburguesa en móvil
- Formularios de edición
- Eliminación de cuenta
- Cambio de contraseña

### Componentes Angular a crear/actualizar:
1. perfil.component.html - Template principal
2. perfil.component.ts - Lógica
3. perfil.component.css - Estilos
4. Interfaces/Models para datos

## Estado actual:
- ✅ Sidebar básico implementado
- ✅ Navegación entre secciones
- ⏳ Falta migrar todas las secciones completas
- ⏳ Falta implementar modales
- ⏳ Falta funcionalidad de fotos
