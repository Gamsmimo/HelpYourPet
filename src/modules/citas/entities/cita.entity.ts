import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Mascota } from '../../mascotas/entities/mascota.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('cita')
export class Cita {
  @ApiProperty({ description: 'ID único de la cita', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Descripción de la cita' })
  @Column({ length: 255, nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'Estado de la cita', example: 'Pendiente' })
  @Column({ length: 255, nullable: true })
  estado: string;

  @ApiProperty({ description: 'Fecha y hora de la cita' })
  @Column({ type: 'timestamp', nullable: true })
  fechaHora: Date;

  @ApiProperty({ description: 'Motivo de la cita', example: 'Consulta general' })
  @Column({ length: 255, nullable: true })
  motivo: string;

  @ApiProperty({ description: 'ID de la mascota' })
  @Column()
  idMascota: number;

  @ApiProperty({ description: 'ID del usuario' })
  @Column()
  idUsuario: number;

  @ApiProperty({ description: 'ID de la veterinaria' })
  @Column()
  idVeterinaria: number;

  @ManyToOne(() => Mascota)
  @JoinColumn({ name: 'idMascota' })
  mascota: Mascota;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;

  @ManyToOne(() => Veterinaria)
  @JoinColumn({ name: 'idVeterinaria' })
  veterinaria: Veterinaria;
}
