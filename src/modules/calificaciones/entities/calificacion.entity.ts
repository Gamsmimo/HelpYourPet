import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('calificacion')
export class Calificacion {
  @ApiProperty({ description: 'ID único de la calificación', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_calificacion' })
  id: number;

  @ApiProperty({ description: 'ID del usuario' })
  @Column({ name: 'id_usuario' })
  idUsuario: number;

  @ApiProperty({ description: 'ID de la veterinaria' })
  @Column({ name: 'id_veterinaria' })
  idVeterinaria: number;

  @ApiProperty({ description: 'Puntuación', example: 5, minimum: 1, maximum: 5 })
  @Column({ type: 'int', nullable: true })
  puntuacion: number;

  @ApiProperty({ description: 'Comentario', example: 'Excelente servicio' })
  @Column({ type: 'text', nullable: true })
  comentario: string;

  @ApiProperty({ description: 'Fecha de la calificación' })
  @Column({ name: 'fecha_calificacion', type: 'timestamp', nullable: true })
  fechaCalificacion: Date;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Veterinaria)
  @JoinColumn({ name: 'id_veterinaria' })
  veterinaria: Veterinaria;
}
