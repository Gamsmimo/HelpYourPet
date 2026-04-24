import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('perfil_veterinario')
export class PerfilVeterinario {
  @ApiProperty({ description: 'ID único del perfil', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_perfil_veterinario' })
  id: number;

  @ApiProperty({ description: 'Especialidad del veterinario', example: 'Cirugía' })
  @Column({ length: 255, nullable: true })
  especialidad: string;

  @ApiProperty({ description: 'Años de experiencia', example: 10 })
  @Column({ type: 'int', nullable: true, name: 'experiencia_anos' })
  experiencia: number;

  @ApiProperty({ description: 'Tarjeta profesional', example: 'TP-12345' })
  @Column({ length: 255, nullable: true, name: 'tarjeta_profesional' })
  tarjetaProfesional: string;

  @ApiProperty({ description: 'Estado activo del veterinario', example: true })
  @Column({ type: 'boolean', default: true, name: 'estado' })
  estado: boolean;

  @ApiProperty({ description: 'ID del usuario' })
  @Column({ name: 'id_usuario' })
  idUsuario: number;

  @ApiProperty({ description: 'ID de la veterinaria asociada' })
  @Column({ name: 'id_veterinaria', nullable: true })
  idVeterinaria: number | null;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Veterinaria)
  @JoinColumn({ name: 'id_veterinaria' })
  veterinaria: Veterinaria;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
