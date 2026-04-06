import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('mascotas')
export class Mascota {
  @ApiProperty({ description: 'ID único de la mascota', example: 1 })
  @PrimaryGeneratedColumn()
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

  @ApiProperty({ description: 'Género', example: 'Macho' })
  @Column({ length: 255, nullable: true })
  genero: string;

  @ApiProperty({ description: 'Descripción', required: false })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'URL de la foto', required: false })
  @Column({ length: 255, nullable: true })
  foto: string;

  @ApiProperty({ description: 'Tamaño', example: 'Mediano' })
  @Column({ length: 255, nullable: true })
  tamaño: string;

  @ApiProperty({ description: 'Unidad de edad', example: 'años' })
  @Column({ length: 255, nullable: true })
  unidadEdad: string;

  @ApiProperty({ description: 'ID del usuario dueño' })
  @Column()
  idUsuario: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;
}
