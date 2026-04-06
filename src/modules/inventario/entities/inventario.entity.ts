import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Producto } from '../../productos/entities/producto.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('inventario')
export class Inventario {
  @ApiProperty({ description: 'ID único del inventario', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Cantidad disponible', example: 100 })
  @Column({ type: 'int', nullable: true })
  cantidad: number;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @Column({ type: 'date', nullable: true })
  fechaActualizacion: Date;

  @ApiProperty({ description: 'ID del producto' })
  @Column()
  idProducto: number;

  @ApiProperty({ description: 'ID de la veterinaria' })
  @Column()
  idVeterinaria: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @ManyToOne(() => Veterinaria)
  @JoinColumn({ name: 'idVeterinaria' })
  veterinaria: Veterinaria;
}
