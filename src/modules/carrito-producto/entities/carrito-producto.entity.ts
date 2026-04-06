import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Carrito } from '../../carrito/entities/carrito.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('carritoproducto')
export class CarritoProducto {
  @ApiProperty({ description: 'ID único', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Cantidad del producto', example: 2 })
  @Column({ type: 'int', nullable: true })
  cantidad: number;

  @ApiProperty({ description: 'Precio unitario', example: 50000 })
  @Column({ type: 'double', nullable: true })
  precio: number;

  @ApiProperty({ description: 'ID del carrito' })
  @Column()
  idCarrito: number;

  @ApiProperty({ description: 'ID del producto' })
  @Column()
  idProducto: number;

  @ManyToOne(() => Carrito)
  @JoinColumn({ name: 'idCarrito' })
  carrito: Carrito;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;
}
