import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Rol } from '../../roles/entities/rol.entity';

@Entity('usuario')
export class Usuario {
  @ApiProperty({ description: 'ID único del usuario', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id: number;

  @ApiProperty({ description: 'Nombres del usuario', example: 'Juan Carlos' })
  @Column({ length: 100, name: 'nombre' })
  nombres: string;

  @ApiProperty({ description: 'Apellidos del usuario', example: 'García Martínez' })
  @Column({ length: 100, name: 'apellido' })
  apellidos: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'usuario@example.com' })
  @Column({ length: 150, unique: true })
  correo: string;

  @ApiProperty({ description: 'Contraseña encriptada' })
  @Column({ length: 255, select: false, name: 'contrasena' })
  password: string;

  @ApiProperty({ description: 'Teléfono', example: '3001234567' })
  @Column({ length: 20, nullable: true })
  telefono: string;

  @ApiProperty({ description: 'Dirección', example: 'Calle 123 #45-67', required: false })
  @Column({ type: 'text', nullable: true })
  direccion: string;

  @ApiProperty({ description: 'URL de la foto de perfil', required: false })
  @Column({ length: 255, nullable: true, name: 'foto_perfil' })
  imagen: string;

  @ApiProperty({ description: 'Tipo de documento', example: 'CC', required: false })
  @Column({ length: 10, nullable: true })
  tipo_documento: string;

  @ApiProperty({ description: 'Número de documento', example: '1234567890', required: false })
  @Column({ length: 50, nullable: true })
  num_documento: string;

  @ApiProperty({ description: 'Edad del usuario', example: 25, required: false })
  @Column({ type: 'int', nullable: true })
  edad: number;

  @ApiProperty({ description: 'ID del rol', required: false })
  @Column({ name: 'id_rol' })
  rol_id: number;

  @ApiProperty({ description: 'Estado activo del usuario', example: true })
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Rol, { eager: true })
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  // Alias para compatibilidad con código existente
  get activo(): boolean {
    return this.estado;
  }

  set activo(value: boolean) {
    this.estado = value;
  }
}
