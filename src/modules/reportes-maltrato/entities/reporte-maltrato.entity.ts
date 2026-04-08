import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('reporte_maltrato')
export class ReporteMaltrato {
  @ApiProperty({ description: 'ID único del reporte', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_reporte' })
  id: number;

  @ApiProperty({ description: 'Descripción del reporte' })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'Estado del reporte', example: 'Pendiente' })
  @Column({ length: 255, nullable: true })
  estado: string;

  @ApiProperty({ description: 'Fecha del reporte' })
  @Column({ name: 'fecha_reporte', type: 'timestamp', nullable: true })
  fechaReporte: Date;

  @ApiProperty({ description: 'Evidencia', example: 'foto.jpg' })
  @Column({ name: 'evidencia', length: 255, nullable: true })
  evidencia: string;

  @ApiProperty({ description: 'Ubicación del incidente' })
  @Column({ length: 255, nullable: true })
  ubicacion: string;

  @ApiProperty({ description: 'ID del usuario que reporta' })
  @Column({ name: 'id_usuario' })
  idUsuario: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
