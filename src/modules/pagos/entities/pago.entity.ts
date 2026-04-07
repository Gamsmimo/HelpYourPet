import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Venta } from '../../ventas/entities/venta.entity';

@Entity('pago')
export class Pago {
  @ApiProperty({ description: 'ID único del pago', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Fecha del pago' })
  @Column({ type: 'date', nullable: true })
  fecha: Date;

  @ApiProperty({ description: 'Método de pago', example: 'Tarjeta de crédito' })
  @Column({ length: 255, nullable: true })
  metodoPago: string;

  @ApiProperty({ description: 'Monto del pago', example: 150000 })
  @Column({ type: 'decimal', nullable: true })
  monto: number;

  @ApiProperty({ description: 'ID de la venta' })
  @Column()
  idVenta: number;

  @ManyToOne(() => Venta)
  @JoinColumn({ name: 'idVenta' })
  venta: Venta;
}
