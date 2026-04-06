import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Rol } from '../../roles/entities/rol.entity';

@Entity('usuarios')
export class Usuario {
  @ApiProperty({ description: 'ID único del usuario', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Estado activo del usuario', example: true })
  @Column({ type: 'tinyint', default: 1 })
  activo: boolean;

  @ApiProperty({ description: 'Apellidos del usuario', example: 'García Martínez' })
  @Column({ length: 100 })
  apellidos: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'usuario@example.com' })
  @Column({ length: 150, unique: true })
  correo: string;

  @ApiProperty({ description: 'Dirección', example: 'Calle 123 #45-67', required: false })
  @Column({ length: 255, nullable: true })
  direccion: string;

  @ApiProperty({ description: 'Edad del usuario', example: 25 })
  @Column({ type: 'int' })
  edad: number;

  @ApiProperty({ description: 'URL de la imagen de perfil', required: false })
  @Column({ length: 255, nullable: true })
  imagen: string;

  @ApiProperty({ description: 'Nombres del usuario', example: 'Juan Carlos' })
  @Column({ length: 100 })
  nombres: string;

  @ApiProperty({ description: 'Número de documento', example: '1234567890' })
  @Column({ length: 50, unique: true })
  num_documento: string;

  @ApiProperty({ description: 'Contraseña encriptada' })
  @Column({ length: 255, select: false })
  password: string;

  @ApiProperty({ description: 'Teléfono', example: '3001234567' })
  @Column({ length: 20 })
  telefono: string;

  @ApiProperty({ description: 'Tipo de documento', example: 'CC' })
  @Column({ length: 20 })
  tipo_documento: string;

  @ApiProperty({ description: 'ID del rol', required: false })
  @Column({ nullable: true })
  rol_id: number;

  @ManyToOne(() => Rol, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;
}
