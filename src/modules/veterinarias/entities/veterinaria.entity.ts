import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('veterinaria')
export class Veterinaria {
  @ApiProperty({ description: 'ID único de la veterinaria', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre de la veterinaria', example: 'Veterinaria Central' })
  @Column({ length: 255, nullable: true })
  nombre: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'contacto@vetcentral.com' })
  @Column({ length: 255, nullable: true })
  correo: string;

  @ApiProperty({ description: 'Descripción', required: false })
  @Column({ length: 255, nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'Dirección', example: 'Calle 100 #50-25' })
  @Column({ length: 255, nullable: true })
  direccion: string;

  @ApiProperty({ description: 'Estado', example: 'Activo' })
  @Column({ length: 255, nullable: true })
  estado: string;

  @ApiProperty({ description: 'Horario de atención', example: 'Lun-Vie 8am-6pm' })
  @Column({ length: 255, nullable: true })
  horario: string;

  @ApiProperty({ description: 'RUT', example: '900123456-7' })
  @Column({ length: 255, nullable: true })
  rut: string;

  @ApiProperty({ description: 'Teléfono', example: '3001234567' })
  @Column({ length: 255, nullable: true })
  telefono: string;
}
