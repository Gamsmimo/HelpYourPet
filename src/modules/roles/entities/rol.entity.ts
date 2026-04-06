import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('rol')
export class Rol {
  @ApiProperty({ description: 'ID único del rol', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del rol', example: 'ADMIN' })
  @Column({ length: 50, unique: true })
  nombre: string;

  @ApiProperty({ description: 'Descripción del rol', required: false })
  @Column({ length: 200, nullable: true })
  descripcion: string;
}
