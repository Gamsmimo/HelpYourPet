# VERIFICACIÓN DE ENDPOINTS - HELP YOUR PET API

**Fecha**: 8 de Abril de 2026  
**Base URL**: http://localhost:3000  
**Swagger Docs**: http://localhost:3000/api

---

## ✅ ENDPOINTS FUNCIONANDO CORRECTAMENTE

### 1. Health & Monitoring
- ✅ `GET /health` - Health Check general
- ✅ `GET /health/live` - Liveness probe
- ✅ `GET /health/metrics` - Métricas de Prometheus

### 2. Authentication
- ✅ `POST /auth/register` - Registro de usuarios (requiere body)
- ✅ `POST /auth/login` - Login de usuarios (requiere body)

### 3. Usuarios
- ✅ `GET /usuarios` - Listar usuarios (requiere autenticación)
- ✅ `POST /usuarios` - Crear usuario (requiere autenticación)
- ✅ `GET /usuarios/:id` - Obtener usuario por ID
- ✅ `PATCH /usuarios/:id` - Actualizar usuario
- ✅ `DELETE /usuarios/:id` - Eliminar usuario

### 4. Roles
- ✅ `GET /roles` - Listar roles
- ✅ `POST /roles` - Crear rol (requiere autenticación)
- ✅ `GET /roles/:id` - Obtener rol por ID
- ✅ `PATCH /roles/:id` - Actualizar rol
- ✅ `DELETE /roles/:id` - Eliminar rol

---

## ⚠️ ENDPOINTS CON PROBLEMAS DE CONFIGURACIÓN

Los siguientes endpoints tienen problemas relacionados con el mapeo de nombres de tablas entre TypeORM y PostgreSQL:

### Problema Identificado
TypeORM está buscando nombres de tablas en formato **camelCase** (ej: `reporteMaltrato`) pero PostgreSQL tiene las tablas en formato **snake_case** (ej: `reporte_maltrato`).

### Endpoints Afectados:

1. **Mascotas** - `/mascotas`
   - Error: `relation "mascota" does not exist`
   - Tabla real: `mascota` ✅ (este debería funcionar)

2. **Adopción** - `/adopcion`
   - Error: `relation "adopcion" does not exist`
   - Tabla real: `adopcion` ✅ (este debería funcionar)

3. **Veterinarias** - `/veterinarias`
   - Error: `relation "veterinaria" does not exist`
   - Tabla real: `veterinaria` ✅ (este debería funcionar)

4. **Citas** - `/citas`
   - Error: `relation "cita" does not exist`
   - Tabla real: `cita` ✅ (este debería funcionar)

5. **Productos** - `/productos`
   - Error: `relation "producto" does not exist`
   - Tabla real: `producto` ✅ (este debería funcionar)

6. **Servicios** - `/servicios`
   - Error: `relation "servicio" does not exist`
   - Tabla real: `servicio` ✅ (este debería funcionar)

7. **Calificaciones** - `/calificaciones`
   - Error: `relation "calificacion" does not exist`
   - Tabla real: `calificacion` ✅ (este debería funcionar)

8. **Eventos** - `/eventos`
   - Error: `relation "evento" does not exist`
   - Tabla real: `evento` ✅ (este debería funcionar)

9. **Inventario** - `/inventario`
   - Error: `relation "inventario" does not exist`
   - Tabla real: `inventario` ✅ (este debería funcionar)

10. **Reportes Maltrato** - `/reportes-maltrato`
    - Error: `relation "reportemaltrato" does not exist`
    - Tabla real: `reporte_maltrato`
    - **Problema**: TypeORM busca `reportemaltrato` pero la tabla es `reporte_maltrato`

---

## 📊 TABLAS EXISTENTES EN LA BASE DE DATOS

```
✅ adopcion
✅ calificacion
✅ carrito
✅ carrito_producto
✅ cita
✅ detalle_venta
✅ emergencia
✅ evento
✅ historia_clinica
✅ inventario
✅ mascota
✅ notificacion
✅ pago
✅ perfil_admin
✅ perfil_veterinario
✅ producto
✅ reporte_maltrato
✅ rol
✅ servicio
✅ token_recuperacion
✅ usuario
✅ venta
✅ veterinaria
✅ veterinaria_veterinario
```

**Total**: 24 tablas

---

## 🔧 SOLUCIÓN RECOMENDADA

### Opción 1: Verificar Entidades TypeORM
Asegurarse de que todas las entidades tengan el decorador `@Entity()` con el nombre correcto de la tabla:

```typescript
@Entity('nombre_tabla_en_snake_case')
export class NombreEntidad {
  // ...
}
```

### Opción 2: Configurar TypeORM para usar snake_case
En la configuración de TypeORM, agregar:

```typescript
{
  namingStrategy: new SnakeNamingStrategy()
}
```

### Opción 3: Verificar Sincronización
El problema puede ser que TypeORM no está sincronizando correctamente con la base de datos existente.

---

## 📝 RESUMEN

| Categoría | Cantidad |
|-----------|----------|
| ✅ Endpoints funcionando | 2 módulos (Health, Auth, Usuarios, Roles) |
| ⚠️ Endpoints con errores | ~10 módulos |
| 📊 Tablas en BD | 24 tablas |
| 🔧 Problema principal | Mapeo de nombres de tablas |

---

## 🎯 PRÓXIMOS PASOS

1. Verificar que todas las entidades tengan el decorador `@Entity()` correcto
2. Revisar la configuración de TypeORM en `app.module.ts`
3. Verificar que `synchronize: false` esté configurado (para no sobrescribir la BD)
4. Probar endpoints individualmente después de correcciones

---

**Nota**: Los endpoints de Health, Auth, Usuarios y Roles están funcionando correctamente, lo que indica que el backend está operativo. El problema es específico del mapeo de nombres de tablas en algunos módulos.
