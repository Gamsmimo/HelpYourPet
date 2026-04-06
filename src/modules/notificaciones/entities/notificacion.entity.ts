import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('notificacion')
export class Notificacion {
  @ApiProperty({ description: 'ID único de la notificación', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Estado de la notificación', example: 'No leída' })
  @Column({ length: 255, nullable: true })
  estado: string;

  @ApiProperty({ description: 'Fecha de la notificación' })
  @Column({ type: 'date', nullable: true })
  fecha: Date;

  @ApiProperty({ description: 'Mensaje de la notificación' })
  @Column({ type: 'text', nullable: true })
  mensaje: string;

  @ApiProperty({ description: 'Tipo de notificación', example: 'Recordatorio' })
  @Column({ length: 255, nullable: true })
  tipo: string;

  @ApiProperty({ description: 'ID del usuario' })
  @Column()
  idUsuario: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;
}
