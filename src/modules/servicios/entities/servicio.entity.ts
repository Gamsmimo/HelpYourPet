import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('servicio')
export class Servicio {
  @ApiProperty({ description: 'ID único del servicio', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Descripción del servicio' })
  @Column({ length: 255, nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'Duración en minutos', example: 30 })
  @Column({ type: 'int', nullable: true })
  duracion: number;

  @ApiProperty({ description: 'Nombre del servicio', example: 'Consulta general' })
  @Column({ length: 255, nullable: true })
  nombre: string;

  @ApiProperty({ description: 'Precio del servicio', example: 50000 })
  @Column({ type: 'decimal', nullable: true })
  precio: number;

  @ApiProperty({ description: 'ID de la veterinaria' })
  @Column()
  idVeterinaria: number;

  @ManyToOne(() => Veterinaria)
  @JoinColumn({ name: 'idVeterinaria' })
  veterinaria: Veterinaria;
}
