import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('publicacion')
export class Publicacion {
  @ApiProperty({ description: 'ID único de la publicación', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_publicacion' })
  id: number;

  @ApiProperty({ description: 'ID del usuario que crea la publicación' })
  @Column({ name: 'id_usuario' })
  idUsuario: number;

  @ApiProperty({ description: 'Contenido de la publicación' })
  @Column({ type: 'text' })
  contenido: string;

  @ApiProperty({ description: 'URL de la imagen (opcional)', required: false })
  @Column({ length: 255, nullable: true })
  imagen: string;

  @ApiProperty({ description: 'Cantidad de likes', example: 0 })
  @Column({ type: 'int', default: 0 })
  likes: number;

  @ApiProperty({ description: 'Cantidad de comentarios', example: 0 })
  @Column({ type: 'int', default: 0 })
  comentarios: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
