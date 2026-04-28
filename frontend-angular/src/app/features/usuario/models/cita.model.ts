export interface Cita {
  id: number;
  fechaHora: Date;
  motivo: string;
  estado: string;
  observaciones?: string;
  usuario_id: number;
  mascota_id: number;
  veterinario_id?: number;
  veterinaria_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCitaDto {
  fechaHora: Date;
  motivo: string;
  mascota_id: number;
  veterinaria_id?: number;
}
