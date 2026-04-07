import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('rol')
export class Rol {
  @ApiProperty({ description: 'ID único del rol', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_rol' })
  id: number;

  @ApiProperty({ description: 'Nombre del rol', example: 'ADMIN' })
  @Column({ length: 50, unique: true, name: 'nombre_rol' })
  nombre: string;

  @ApiProperty({ description: 'Descripción del rol', required: false })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
