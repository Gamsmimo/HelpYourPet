import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Servicio } from '../../servicios/entities/servicio.entity';

@Entity('calificacion')
export class Calificacion {
  @ApiProperty({ description: 'ID único de la calificación', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Comentario', example: 'Excelente servicio' })
  @Column({ length: 255, nullable: true })
  comentario: string;

  @ApiProperty({ description: 'Estado', example: 'Aprobado' })
  @Column({ length: 255, nullable: true })
  estado: string;

  @ApiProperty({ description: 'Fecha de la calificación' })
  @Column({ type: 'date', nullable: true })
  fecha: Date;

  @ApiProperty({ description: 'Puntuación', example: 5, minimum: 1, maximum: 5 })
  @Column({ type: 'int', nullable: true })
  puntuacion: number;

  @ApiProperty({ description: 'ID del servicio', required: false })
  @Column({ nullable: true })
  idServicio: number;

  @ApiProperty({ description: 'ID del usuario' })
  @Column()
  idUsuario: number;

  @ApiProperty({ description: 'ID del veterinario', required: false })
  @Column({ nullable: true })
  idVeterinario: number;

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: 'idServicio' })
  servicio: Servicio;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idVeterinario' })
  veterinario: Usuario;
}
