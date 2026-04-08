import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('token_recuperacion')
export class TokenRecuperacion {
  @ApiProperty({ description: 'ID único del token', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Fecha de expiración del token' })
  @Column({ type: 'timestamp', nullable: true })
  fechaExpiracion: Date;

  @ApiProperty({ description: 'Token de recuperación' })
  @Column({ length: 255, nullable: true })
  token: string;

  @ApiProperty({ description: 'ID del usuario' })
  @Column()
  idUsuario: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;
}
