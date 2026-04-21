import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Publicacion } from './publicacion.entity';

@Entity('comentario')
export class Comentario {
  @ApiProperty({ description: 'ID único del comentario', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_comentario' })
  id: number;

  @ApiProperty({ description: 'ID de la publicación' })
  @Column({ name: 'id_publicacion' })
  idPublicacion: number;

  @ApiProperty({ description: 'ID del usuario que comenta' })
  @Column({ name: 'id_usuario' })
  idUsuario: number;

  @ApiProperty({ description: 'Contenido del comentario' })
  @Column({ type: 'text' })
  contenido: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Publicacion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_publicacion' })
  publicacion: Publicacion;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
