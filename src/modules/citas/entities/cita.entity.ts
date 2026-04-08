import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Mascota } from '../../mascotas/entities/mascota.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('cita')
export class Cita {
  @ApiProperty({ description: 'ID único de la cita', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_cita' })
  id: number;

  @ApiProperty({ description: 'ID del usuario' })
  @Column({ name: 'id_usuario' })
  idUsuario: number;

  @ApiProperty({ description: 'ID de la mascota' })
  @Column({ name: 'id_mascota' })
  idMascota: number;

  @ApiProperty({ description: 'ID de la veterinaria' })
  @Column({ name: 'id_veterinaria' })
  idVeterinaria: number;

  @ApiProperty({ description: 'ID del servicio' })
  @Column({ name: 'id_servicio', nullable: true })
  idServicio: number;

  @ApiProperty({ description: 'Estado de la cita', example: 'Pendiente' })
  @Column({ length: 255, nullable: true })
  estado: string;

  @ApiProperty({ description: 'Fecha y hora de la cita' })
  @Column({ name: 'fecha_hora', type: 'timestamp', nullable: true })
  fechaHora: Date;

  @ApiProperty({ description: 'Motivo de la cita', example: 'Consulta general' })
  @Column({ type: 'text', nullable: true })
  motivo: string;

  @ApiProperty({ description: 'Observaciones' })
  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Mascota)
  @JoinColumn({ name: 'id_mascota' })
  mascota: Mascota;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Veterinaria)
  @JoinColumn({ name: 'id_veterinaria' })
  veterinaria: Veterinaria;
}
