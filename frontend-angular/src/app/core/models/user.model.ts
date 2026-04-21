export interface User {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  num_documento?: string;
  tipo_documento?: string;
  edad?: number;
  rol_id: number;
  activo: boolean;
  imagen?: string | null;
  rol?: string;
}

export interface LoginDto {
  correo: string;
  contrasena: string;
}

export interface RegisterDto {
  nombre: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  tipo_documento?: string;
  num_documento?: string;
  edad?: number;
  telefono?: string;
  direccion?: string;
  idRol?: number;
}

export interface AuthResponse {
  access_token: string;
}
