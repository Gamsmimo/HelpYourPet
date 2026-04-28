export interface UsuarioPerfil {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string | null;
  direccion: string | null;
  imagen: string | null;
}

export interface PerfilVeterinario {
  id: number;
  especialidad: string | null;
  experiencia: number | null;
  tarjetaProfesional: string | null;
  estado: boolean;
  idUsuario: number;
  idVeterinaria: number | null;
  usuario: UsuarioPerfil;
}

export interface EventoVeterinaria {
  id: number;
  nombre: string;
  descripcion: string | null;
  fecha: string;
  fechafin: string;
  imagen: string;
  idVeterinaria: number;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen: string | null;
  categoria: string | null;
}

export interface InventarioItem {
  id: number;
  cantidad: number;
  estado: string;
  fechaActualizacion: string | null;
  idProducto: number;
  idVeterinaria: number;
  producto: Producto;
}

export interface CreateEventoDto {
  nombre: string;
  descripcion: string;
  fecha: string;
  fechafin: string;
  imagen: string;
  idVeterinaria: number;
}

export interface CreateProductoDto {
  nombre: string;
  categoria?: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
}

export interface CreateInventarioDto {
  cantidad: number;
  estado?: string;
  fechaActualizacion?: string;
  idProducto: number;
  idVeterinaria: number;
}
