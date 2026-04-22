import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('servicio')
export class Servicio {
  @ApiProperty({ description: 'ID único del servicio', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_servicio' })
  id: number;

  @ApiProperty({ description: 'Descripción del servicio' })
  @Column({ length: 255, nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'Duración estimada en minutos', example: 30 })
  @Column({ name: 'duracion_estimada', type: 'int', nullable: true })
  duracionEstimada: number;

  @ApiProperty({ description: 'Nombre del servicio', example: 'Consulta general' })
  @Column({ length: 255, nullable: true })
  nombre: string;

  @ApiProperty({ description: 'Precio del servicio', example: 50000 })
  @Column({ type: 'decimal', nullable: true })
  precio: number;

  @ApiProperty({ description: 'Estado del servicio', example: true })
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @ApiProperty({ description: 'ID de la veterinaria' })
  @Column({ name: 'id_veterinaria', nullable: true })
  idVeterinaria: number;

  @ManyToOne(() => Veterinaria)
  @JoinColumn({ name: 'id_veterinaria' })
  veterinaria: Veterinaria;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
