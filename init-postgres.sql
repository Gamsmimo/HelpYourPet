-- Script de inicialización de base de datos PostgreSQL para Help Your Pet
-- Migrado desde MySQL a PostgreSQL

-- Eliminar tablas si existen (en orden inverso por dependencias)
DROP TABLE IF EXISTS carrito_producto CASCADE;
DROP TABLE IF EXISTS detalle_venta CASCADE;
DROP TABLE IF EXISTS veterinaria_veterinario CASCADE;
DROP TABLE IF EXISTS historia_clinica CASCADE;
DROP TABLE IF EXISTS calificacion CASCADE;
DROP TABLE IF EXISTS emergencia CASCADE;
DROP TABLE IF EXISTS evento CASCADE;
DROP TABLE IF EXISTS notificacion CASCADE;
DROP TABLE IF EXISTS reporte_maltrato CASCADE;
DROP TABLE IF EXISTS token_recuperacion CASCADE;
DROP TABLE IF EXISTS cita CASCADE;
DROP TABLE IF EXISTS adopcion CASCADE;
DROP TABLE IF EXISTS mascota CASCADE;
DROP TABLE IF EXISTS carrito CASCADE;
DROP TABLE IF EXISTS venta CASCADE;
DROP TABLE IF EXISTS pago CASCADE;
DROP TABLE IF EXISTS inventario CASCADE;
DROP TABLE IF EXISTS producto CASCADE;
DROP TABLE IF EXISTS servicio CASCADE;
DROP TABLE IF EXISTS perfil_veterinario CASCADE;
DROP TABLE IF EXISTS perfil_admin CASCADE;
DROP TABLE IF EXISTS veterinaria CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS rol CASCADE;

-- Tabla: rol
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: usuario
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    foto_perfil VARCHAR(255),
    id_rol INTEGER NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE RESTRICT
);

-- Tabla: veterinaria
CREATE TABLE veterinaria (
    id_veterinaria SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(150),
    horario_atencion VARCHAR(100),
    servicios_ofrecidos TEXT,
    calificacion_promedio DECIMAL(3,2) DEFAULT 0.00,
    foto VARCHAR(255),
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: perfil_admin
CREATE TABLE perfil_admin (
    id_perfil_admin SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL UNIQUE,
    permisos TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla: perfil_veterinario
CREATE TABLE perfil_veterinario (
    id_perfil_veterinario SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL UNIQUE,
    especialidad VARCHAR(100),
    licencia VARCHAR(100),
    experiencia_anos INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla: servicio
CREATE TABLE servicio (
    id_servicio SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    duracion_estimada INTEGER,
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: producto
CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    categoria VARCHAR(50),
    imagen VARCHAR(255),
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: inventario
CREATE TABLE inventario (
    id_inventario SERIAL PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 0,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE
);

-- Tabla: pago
CREATE TABLE pago (
    id_pago SERIAL PRIMARY KEY,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: venta
CREATE TABLE venta (
    id_venta SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_pago INTEGER,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE RESTRICT,
    FOREIGN KEY (id_pago) REFERENCES pago(id_pago) ON DELETE SET NULL
);

-- Tabla: carrito
CREATE TABLE carrito (
    id_carrito SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla: mascota
CREATE TABLE mascota (
    id_mascota SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(100),
    edad INTEGER,
    peso DECIMAL(5,2),
    sexo VARCHAR(10),
    color VARCHAR(50),
    foto VARCHAR(255),
    id_usuario INTEGER NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla: adopcion
CREATE TABLE adopcion (
    id_adopcion SERIAL PRIMARY KEY,
    id_mascota INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'pendiente',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla: cita
CREATE TABLE cita (
    id_cita SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_mascota INTEGER NOT NULL,
    id_veterinaria INTEGER NOT NULL,
    id_servicio INTEGER,
    fecha_hora TIMESTAMP NOT NULL,
    motivo TEXT,
    estado VARCHAR(50) DEFAULT 'pendiente',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota) ON DELETE CASCADE,
    FOREIGN KEY (id_veterinaria) REFERENCES veterinaria(id_veterinaria) ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicio(id_servicio) ON DELETE SET NULL
);

-- Tabla: token_recuperacion
CREATE TABLE token_recuperacion (
    id_token SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    fecha_expiracion TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla: reporte_maltrato
CREATE TABLE reporte_maltrato (
    id_reporte SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion TEXT,
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'pendiente',
    evidencia VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla: notificacion
CREATE TABLE notificacion (
    id_notificacion SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(50),
    leida BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla: evento
CREATE TABLE evento (
    id_evento SERIAL PRIMARY KEY,
    id_veterinaria INTEGER NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    ubicacion TEXT,
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_veterinaria) REFERENCES veterinaria(id_veterinaria) ON DELETE CASCADE
);

-- Tabla: emergencia
CREATE TABLE emergencia (
    id_emergencia SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_mascota INTEGER NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion TEXT,
    estado VARCHAR(50) DEFAULT 'activa',
    fecha_emergencia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota) ON DELETE CASCADE
);

-- Tabla: calificacion
CREATE TABLE calificacion (
    id_calificacion SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_veterinaria INTEGER NOT NULL,
    puntuacion INTEGER NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_veterinaria) REFERENCES veterinaria(id_veterinaria) ON DELETE CASCADE
);

-- Tabla: historia_clinica
CREATE TABLE historia_clinica (
    id_historia SERIAL PRIMARY KEY,
    id_mascota INTEGER NOT NULL,
    id_veterinaria INTEGER NOT NULL,
    fecha_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diagnostico TEXT,
    tratamiento TEXT,
    observaciones TEXT,
    peso DECIMAL(5,2),
    temperatura DECIMAL(4,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota) ON DELETE CASCADE,
    FOREIGN KEY (id_veterinaria) REFERENCES veterinaria(id_veterinaria) ON DELETE CASCADE
);

-- Tabla: veterinaria_veterinario
CREATE TABLE veterinaria_veterinario (
    id SERIAL PRIMARY KEY,
    id_veterinaria INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_veterinaria) REFERENCES veterinaria(id_veterinaria) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    UNIQUE(id_veterinaria, id_usuario)
);

-- Tabla: detalle_venta
CREATE TABLE detalle_venta (
    id_detalle SERIAL PRIMARY KEY,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE RESTRICT
);

-- Tabla: carrito_producto
CREATE TABLE carrito_producto (
    id SERIAL PRIMARY KEY,
    id_carrito INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_carrito) REFERENCES carrito(id_carrito) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE,
    UNIQUE(id_carrito, id_producto)
);

-- Insertar roles por defecto
INSERT INTO rol (nombre_rol, descripcion) VALUES
('ADMIN', 'Administrador del sistema'),
('VETERINARIO', 'Veterinario profesional'),
('USUARIO', 'Usuario regular del sistema');

-- Insertar usuario administrador por defecto
-- Contraseña: Admin123! (hasheada con bcrypt)
INSERT INTO usuario (nombre, apellido, correo, contrasena, telefono, id_rol) VALUES
('Admin', 'Sistema', 'admin@helppet.com', '$2b$10$YourHashedPasswordHere', '3001234567', 1);

-- Insertar usuario de prueba
-- Contraseña: Password123! (hasheada con bcrypt)
INSERT INTO usuario (nombre, apellido, correo, contrasena, telefono, direccion, id_rol) VALUES
('Ana', 'García', 'ana.garcia@example.com', '$2b$10$rOJ4XQXQXQXQXQXQXQXQXO', '3009876543', 'Calle 123 #45-67', 3);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_usuario_correo ON usuario(correo);
CREATE INDEX idx_usuario_rol ON usuario(id_rol);
CREATE INDEX idx_mascota_usuario ON mascota(id_usuario);
CREATE INDEX idx_cita_usuario ON cita(id_usuario);
CREATE INDEX idx_cita_mascota ON cita(id_mascota);
CREATE INDEX idx_cita_veterinaria ON cita(id_veterinaria);
CREATE INDEX idx_cita_fecha ON cita(fecha_hora);
CREATE INDEX idx_venta_usuario ON venta(id_usuario);
CREATE INDEX idx_adopcion_mascota ON adopcion(id_mascota);
CREATE INDEX idx_adopcion_usuario ON adopcion(id_usuario);
CREATE INDEX idx_calificacion_veterinaria ON calificacion(id_veterinaria);
CREATE INDEX idx_historia_mascota ON historia_clinica(id_mascota);
CREATE INDEX idx_notificacion_usuario ON notificacion(id_usuario);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_rol_updated_at BEFORE UPDATE ON rol FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuario_updated_at BEFORE UPDATE ON usuario FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_veterinaria_updated_at BEFORE UPDATE ON veterinaria FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_perfil_admin_updated_at BEFORE UPDATE ON perfil_admin FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_perfil_veterinario_updated_at BEFORE UPDATE ON perfil_veterinario FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servicio_updated_at BEFORE UPDATE ON servicio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_producto_updated_at BEFORE UPDATE ON producto FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mascota_updated_at BEFORE UPDATE ON mascota FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cita_updated_at BEFORE UPDATE ON cita FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venta_updated_at BEFORE UPDATE ON venta FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_adopcion_updated_at BEFORE UPDATE ON adopcion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carrito_updated_at BEFORE UPDATE ON carrito FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carrito_producto_updated_at BEFORE UPDATE ON carrito_producto FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Mensaje de finalización
SELECT 'Base de datos Help Your Pet creada exitosamente en PostgreSQL' AS mensaje;
