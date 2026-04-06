import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('perfilveterinario')
export class PerfilVeterinario {
  @ApiProperty({ description: 'ID único del perfil', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Especialidad del veterinario', example: 'Cirugía' })
  @Column({ length: 255, nullable: true })
  especialidad: string;

  @ApiProperty({ description: 'Años de experiencia', example: 10 })
  @Column({ type: 'int', nullable: true })
  experiencia: number;

  @ApiProperty({ description: 'Licencia profesional', example: 'VET-12345' })
  @Column({ length: 255, nullable: true })
  licencia: string;

  @ApiProperty({ description: 'ID del usuario' })
  @Column()
  idUsuario: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;
}
