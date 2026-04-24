import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('veterinaria')
export class Veterinaria {
  @ApiProperty({ description: 'ID único de la veterinaria', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_veterinaria' })
  id: number;

  @ApiProperty({ description: 'Nombre de la veterinaria', example: 'Veterinaria Central' })
  @Column({ length: 255, nullable: true })
  nombre: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'contacto@vetcentral.com' })
  @Column({ length: 255, nullable: true })
  correo: string;

  @ApiProperty({ description: 'Servicios ofrecidos' })
  @Column({ name: 'servicios_ofrecidos', type: 'text', nullable: true })
  serviciosOfrecidos: string;

  @ApiProperty({ description: 'Dirección', example: 'Calle 100 #50-25' })
  @Column({ length: 255, nullable: true })
  direccion: string;

  @ApiProperty({ description: 'Descripción de la veterinaria' })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'Estado', example: true })
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @ApiProperty({ description: 'Horario de atención', example: 'Lun-Vie 8am-6pm' })
  @Column({ name: 'horario_atencion', length: 255, nullable: true })
  horarioAtencion: string;

  @ApiProperty({ description: 'Calificación promedio', example: 4.5 })
  @Column({ name: 'calificacion_promedio', type: 'decimal', precision: 3, scale: 2, nullable: true })
  calificacionPromedio: number;

  @ApiProperty({ description: 'Foto de la veterinaria' })
  @Column({ length: 255, nullable: true })
  foto: string;

  @ApiProperty({ description: 'Teléfono', example: '3001234567' })
  @Column({ length: 255, nullable: true })
  telefono: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
