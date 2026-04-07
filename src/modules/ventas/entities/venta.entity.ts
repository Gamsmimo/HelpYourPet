import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('venta')
export class Venta {
  @ApiProperty({ description: 'ID único de la venta', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Fecha de la venta' })
  @Column({ type: 'date', nullable: true })
  fecha: Date;

  @ApiProperty({ description: 'Total de la venta', example: 150000 })
  @Column({ type: 'decimal', nullable: true })
  total: number;

  @ApiProperty({ description: 'ID del usuario' })
  @Column()
  idUsuario: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;
}
