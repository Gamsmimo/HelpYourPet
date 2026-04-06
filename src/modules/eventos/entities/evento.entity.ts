import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('evento')
export class Evento {
  @ApiProperty({ description: 'ID único del evento', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Descripción del evento' })
  @Column({ length: 255, nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'Fecha del evento' })
  @Column({ type: 'date', nullable: true })
  fecha: Date;

  @ApiProperty({ description: 'Lugar del evento', example: 'Auditorio Principal' })
  @Column({ length: 255, nullable: true })
  lugar: string;

  @ApiProperty({ description: 'Nombre del evento', example: 'Jornada de Vacunación' })
  @Column({ length: 255, nullable: true })
  nombre: string;

  @ApiProperty({ description: 'ID de la veterinaria' })
  @Column()
  idVeterinaria: number;

  @ManyToOne(() => Veterinaria)
  @JoinColumn({ name: 'idVeterinaria' })
  veterinaria: Veterinaria;
}
