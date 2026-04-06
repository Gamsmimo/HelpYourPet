import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum EstadoCarrito {
  ACTIVO = 'ACTIVO',
  CANCELADO = 'CANCELADO',
  COMPRADO = 'COMPRADO',
}

@Entity('carrito')
export class Carrito {
  @ApiProperty({ description: 'ID único del carrito', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Estado del carrito', enum: EstadoCarrito, example: 'ACTIVO' })
  @Column({ type: 'enum', enum: EstadoCarrito, nullable: true })
  estado: EstadoCarrito;

  @ApiProperty({ description: 'ID del usuario' })
  @Column()
  idUsuario: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;
}
