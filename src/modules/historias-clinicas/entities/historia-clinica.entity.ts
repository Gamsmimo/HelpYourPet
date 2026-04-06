import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Mascota } from '../../mascotas/entities/mascota.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('historiaclinica')
export class HistoriaClinica {
  @ApiProperty({ description: 'ID único de la historia clínica', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Diagnóstico', example: 'Infección respiratoria' })
  @Column({ length: 255, nullable: true })
  diagnostico: string;

  @ApiProperty({ description: 'Fecha de la consulta' })
  @Column({ type: 'date', nullable: true })
  fecha: Date;

  @ApiProperty({ description: 'Observaciones adicionales' })
  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ApiProperty({ description: 'Tratamiento prescrito' })
  @Column({ length: 255, nullable: true })
  tratamiento: string;

  @ApiProperty({ description: 'ID de la mascota' })
  @Column()
  idMascota: number;

  @ApiProperty({ description: 'ID del veterinario' })
  @Column()
  idVeterinario: number;

  @ManyToOne(() => Mascota)
  @JoinColumn({ name: 'idMascota' })
  mascota: Mascota;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idVeterinario' })
  veterinario: Usuario;
}
