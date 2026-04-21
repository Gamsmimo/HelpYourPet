import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Publicacion } from './publicacion.entity';

@Entity('reaccion')
@Unique(['idPublicacion', 'idUsuario'])
export class Reaccion {
  @ApiProperty({ description: 'ID único de la reacción', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_reaccion' })
  id: number;

  @ApiProperty({ description: 'ID de la publicación' })
  @Column({ name: 'id_publicacion' })
  idPublicacion: number;

  @ApiProperty({ description: 'ID del usuario que reacciona' })
  @Column({ name: 'id_usuario' })
  idUsuario: number;

  @ApiProperty({ description: 'Tipo de reacción', example: 'like' })
  @Column({ length: 20, default: 'like' })
  tipo: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Publicacion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_publicacion' })
  publicacion: Publicacion;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
