import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Producto } from '../../productos/entities/producto.entity';
import { Venta } from '../../ventas/entities/venta.entity';

@Entity('detalleventa')
export class DetalleVenta {
  @ApiProperty({ description: 'ID único del detalle', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Cantidad del producto', example: 2 })
  @Column({ type: 'int', nullable: true })
  cantidad: number;

  @ApiProperty({ description: 'Precio unitario', example: 50000 })
  @Column({ type: 'decimal', nullable: true })
  precio: number;

  @ApiProperty({ description: 'Subtotal', example: 100000 })
  @Column({ type: 'decimal', nullable: true })
  subtotal: number;

  @ApiProperty({ description: 'ID del producto' })
  @Column()
  idProducto: number;

  @ApiProperty({ description: 'ID de la venta' })
  @Column()
  idVenta: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @ManyToOne(() => Venta)
  @JoinColumn({ name: 'idVenta' })
  venta: Venta;
}
