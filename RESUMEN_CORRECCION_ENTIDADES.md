# RESUMEN DE CORRECCIÓN DE ENTIDADES

## ✅ ENTIDADES CORREGIDAS

He corregido los nombres de las siguientes entidades para que coincidan con las tablas de PostgreSQL:

### 1. **Mascota** ✅
- Antes: `@Entity('mascotas')`
- Después: `@Entity('mascota')`

### 2. **VeterinariaVeterinario** ✅
- Antes: `@Entity('veterinariaveterinario')`
- Después: `@Entity('veterinaria_veterinario')`

### 3. **TokenRecuperacion** ✅
- Antes: `@Entity('tokenrecuperacion')`
- Después: `@Entity('token_recuperacion')`

### 4. **ReporteMaltrato** ✅
- Antes: `@Entity('reportemaltrato')`
- Después: `@Entity('reporte_maltrato')`

### 5. **PerfilVeterinario** ✅
- Antes: `@Entity('perfilveterinario')`
- Después: `@Entity('perfil_veterinario')`

### 6. **PerfilAdmin** ✅
- Antes: `@Entity('perfiladmin')`
- Después: `@Entity('perfil_admin')`

### 7. **HistoriaClinica** ✅
- Antes: `@Entity('historiaclinica')`
- Después: `@Entity('historia_clinica')`

### 8. **DetalleVenta** ✅
- Antes: `@Entity('detalleventa')`
- Después: `@Entity('detalle_venta')`

### 9. **CarritoProducto** ✅
- Antes: `@Entity('carritoproducto')`
- Después: `@Entity('carrito_producto')`

---

## ⚠️ PROBLEMA ADICIONAL IDENTIFICADO

Además de los nombres de tablas, hay un problema con los **nombres de columnas**:

### Problema:
- Las entidades TypeORM usan **camelCase** para las columnas (ej: `idUsuario`)
- PostgreSQL usa **snake_case** para las columnas (ej: `id_usuario`)

### Ejemplo en ReporteMaltrato:
```typescript
// En la entidad:
@Column()
idUsuario: number;

// En PostgreSQL:
id_usuario | integer
```

### Solución Necesaria:
Agregar el decorador `@Column()` con el nombre correcto de la columna:

```typescript
@Column({ name: 'id_usuario' })
idUsuario: number;

@JoinColumn({ name: 'id_usuario' })
usuario: Usuario;
```

---

## 📋 ENTIDADES QUE NECESITAN CORRECCIÓN DE COLUMNAS

Basado en el error detectado, las siguientes entidades probablemente necesitan corrección en los nombres de columnas de claves foráneas:

1. **ReporteMaltrato** - `idUsuario` → `id_usuario`
2. **Adopcion** - Verificar columnas FK
3. **Calificacion** - Verificar columnas FK
4. **Cita** - Verificar columnas FK
5. **Emergencia** - Verificar columnas FK
6. **HistoriaClinica** - Verificar columnas FK
7. **Inventario** - Verificar columnas FK
8. **Mascota** - Verificar columnas FK
9. **Notificacion** - Verificar columnas FK
10. **Pago** - Verificar columnas FK
11. **PerfilAdmin** - Verificar columnas FK
12. **PerfilVeterinario** - Verificar columnas FK
13. **TokenRecuperacion** - Verificar columnas FK
14. **VeterinariaVeterinario** - Verificar columnas FK
15. **CarritoProducto** - Verificar columnas FK
16. **DetalleVenta** - Verificar columnas FK

---

## 🎯 PRÓXIMOS PASOS

Para que todos los endpoints funcionen correctamente, necesitas:

1. **Verificar cada tabla en PostgreSQL** para conocer los nombres exactos de las columnas
2. **Actualizar las entidades** agregando `@Column({ name: 'nombre_columna_en_db' })` donde sea necesario
3. **Actualizar los JoinColumn** para usar los nombres correctos
4. **Reiniciar el backend** después de cada corrección
5. **Probar los endpoints** nuevamente

---

## 📊 ESTADO ACTUAL

| Categoría | Estado |
|-----------|--------|
| Nombres de tablas | ✅ Corregidos (9 entidades) |
| Nombres de columnas | ⚠️ Pendiente de corrección |
| Endpoints funcionando | ~50% (Health, Auth, Usuarios, Roles) |
| Endpoints con errores | ~50% (Requieren corrección de columnas) |

---

## 💡 RECOMENDACIÓN

Para evitar este tipo de problemas en el futuro, considera:

1. **Usar una naming strategy** en TypeORM que convierta automáticamente camelCase a snake_case
2. **Sincronizar TypeORM con la BD** usando `synchronize: true` en desarrollo (con precaución)
3. **Usar migraciones** para mantener la BD y las entidades sincronizadas
4. **Documentar la estructura** de cada tabla para referencia futura

---

**Fecha**: 8 de Abril de 2026  
**Backend**: http://localhost:3000  
**Estado**: En proceso de corrección
