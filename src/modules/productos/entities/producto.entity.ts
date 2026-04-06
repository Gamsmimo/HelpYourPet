import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('producto')
export class Producto {
  @ApiProperty({ description: 'ID único del producto', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Categoría del producto', example: 'Alimento' })
  @Column({ length: 255, nullable: true })
  categoria: string;

  @ApiProperty({ description: 'Descripción del producto' })
  @Column({ length: 255, nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'URL de la imagen del producto' })
  @Column({ length: 255, nullable: true })
  imagen: string;

  @ApiProperty({ description: 'Nombre del producto', example: 'Alimento Premium' })
  @Column({ length: 255, nullable: true })
  nombre: string;

  @ApiProperty({ description: 'Precio del producto', example: 50000 })
  @Column({ type: 'double', nullable: true })
  precio: number;
}
