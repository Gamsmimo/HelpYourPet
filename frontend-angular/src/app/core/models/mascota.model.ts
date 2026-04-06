export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza?: string;
  edad?: number;
  genero?: string;
  descripcion?: string;
  foto?: string;
  usuario_id: number;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMascotaDto {
  nombre: string;
  especie: string;
  raza?: string;
  edad?: number;
  genero?: string;
  descripcion?: string;
  foto?: string;
}
