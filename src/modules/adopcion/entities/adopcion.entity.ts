import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Mascota } from '../../mascotas/entities/mascota.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('adopcion')
export class Adopcion {
  @ApiProperty({ description: 'ID único de la adopción', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_adopcion' })
  id: number;

  @ApiProperty({ description: 'ID de la mascota' })
  @Column({ name: 'id_mascota' })
  idMascota: number;

  @ApiProperty({ description: 'ID del usuario' })
  @Column({ name: 'id_usuario' })
  idUsuario: number;

  @ApiProperty({ description: 'Fecha de solicitud' })
  @Column({ name: 'fecha_solicitud', type: 'timestamp', nullable: true })
  fechaSolicitud: Date;

  @ApiProperty({ description: 'Estado de la adopción', example: 'Pendiente' })
  @Column({ length: 50, nullable: true })
  estado: string;

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
}
