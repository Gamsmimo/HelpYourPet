import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('veterinariaveterinario')
export class VeterinariaVeterinario {
  @ApiProperty({ description: 'ID único', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Fecha de asignación' })
  @Column({ type: 'date', nullable: true })
  fechaAsignacion: Date;

  @ApiProperty({ description: 'ID de la veterinaria' })
  @Column()
  idVeterinaria: number;

  @ApiProperty({ description: 'ID del veterinario' })
  @Column()
  idVeterinario: number;

  @ManyToOne(() => Veterinaria)
  @JoinColumn({ name: 'idVeterinaria' })
  veterinaria: Veterinaria;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idVeterinario' })
  veterinario: Usuario;
}
