import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('perfil_admin')
export class PerfilAdmin {
  @ApiProperty({ description: 'ID único del perfil', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Cargo del administrador', example: 'Administrador General' })
  @Column({ length: 255, nullable: true })
  cargo: string;

  @ApiProperty({ description: 'Departamento', example: 'Sistemas' })
  @Column({ length: 255, nullable: true })
  departamento: string;

  @ApiProperty({ description: 'Permisos especiales' })
  @Column({ type: 'text', nullable: true })
  permisos: string;

  @ApiProperty({ description: 'ID del usuario' })
  @Column()
  idUsuario: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;
}
