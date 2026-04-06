import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Mascota } from '../../mascotas/entities/mascota.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('emergencia')
export class Emergencia {
  @ApiProperty({ description: 'ID único de la emergencia', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Descripción de la emergencia' })
  @Column({ length: 255, nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'Estado de la emergencia', example: 'En proceso' })
  @Column({ length: 255, nullable: true })
  estado: string;

  @ApiProperty({ description: 'Fecha y hora de la emergencia' })
  @Column({ type: 'datetime', nullable: true })
  fechaHora: Date;

  @ApiProperty({ description: 'Tipo de emergencia', example: 'Accidente' })
  @Column({ length: 255, nullable: true })
  tipo: string;

  @ApiProperty({ description: 'ID de la mascota' })
  @Column()
  idMascota: number;

  @ApiProperty({ description: 'ID del usuario' })
  @Column()
  idUsuario: number;

  @ApiProperty({ description: 'ID de la veterinaria', required: false })
  @Column({ nullable: true })
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
