import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('mascota')
export class Mascota {
  @ApiProperty({ description: 'ID único de la mascota', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_mascota' })
  id: number;

  @ApiProperty({ description: 'Nombre de la mascota', example: 'Firulais' })
  @Column({ length: 255, nullable: true })
  nombre: string;

  @ApiProperty({ description: 'Especie', example: 'Perro' })
  @Column({ length: 255, nullable: true })
  especie: string;

  @ApiProperty({ description: 'Raza', example: 'Labrador' })
  @Column({ length: 100, nullable: true })
  raza: string;

  @ApiProperty({ description: 'Edad', example: 3 })
  @Column({ type: 'int', nullable: true })
  edad: number;

  @ApiProperty({ description: 'Sexo/Género', example: 'Macho' })
  @Column({ name: 'sexo', length: 20, nullable: true })
  sexo: string;

  @ApiProperty({ description: 'Unidad de edad', example: 'Años' })
  @Column({ name: 'unidad_edad', length: 20, nullable: true })
  unidadEdad: string;

  @ApiProperty({ description: 'Tamaño', example: 'Mediano' })
  @Column({ length: 50, nullable: true })
  tamano: string;

  @ApiProperty({ description: 'Descripción', example: 'Mascota muy juguetona' })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'URL de la foto', required: false })
  @Column({ length: 255, nullable: true })
  foto: string;

  @ApiProperty({ description: 'Estado', example: true })
  @Column({ name: 'estado', type: 'boolean', default: true })
  estado: boolean;

  @ApiProperty({ description: 'ID del usuario dueño' })
  @Column({ name: 'id_usuario' })
  idUsuario: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
