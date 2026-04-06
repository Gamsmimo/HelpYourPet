import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Mascota } from '../../mascotas/entities/mascota.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('adopcion')
export class Adopcion {
  @ApiProperty({ description: 'ID único de la adopción', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Contacto del adoptante', example: '3001234567' })
  @Column({ length: 255, nullable: true })
  contacto: string;

  @ApiProperty({ description: 'Descripción de la adopción' })
  @Column({ length: 255, nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'Edad de la mascota', example: 3 })
  @Column({ type: 'int', nullable: true })
  edad: number;

  @ApiProperty({ description: 'Estado de la adopción', example: 'Pendiente' })
  @Column({ length: 255, nullable: true })
  estado: string;

  @ApiProperty({ description: 'Fecha de publicación' })
  @Column({ type: 'datetime', nullable: true })
  fechaPublicacion: Date;

  @ApiProperty({ description: 'Género de la mascota', example: 'Macho' })
  @Column({ length: 255, nullable: true })
  genero: string;

  @ApiProperty({ description: 'URL de la imagen' })
  @Column({ length: 255, nullable: true })
  imagen: string;

  @ApiProperty({ description: 'Nombre de la mascota', example: 'Firulais' })
  @Column({ length: 255, nullable: true })
  nombreMascota: string;

  @ApiProperty({ description: 'Raza', example: 'Labrador' })
  @Column({ length: 255, nullable: true })
  raza: string;

  @ApiProperty({ description: 'Tamaño', example: 'Mediano' })
  @Column({ length: 255, nullable: true })
  tamano: string;

  @ApiProperty({ description: 'Tipo de mascota', example: 'Perro' })
  @Column({ length: 255, nullable: true })
  tipoMascota: string;

  @ApiProperty({ description: 'ID de la mascota', required: false })
  @Column({ nullable: true })
  idMascota: number;

  @ApiProperty({ description: 'ID del usuario' })
  @Column()
  usuario_id: number;

  @ApiProperty({ description: 'ID de la veterinaria', required: false })
  @Column({ nullable: true })
  veterinaria_id: number;

  @ManyToOne(() => Mascota)
  @JoinColumn({ name: 'idMascota' })
  mascota: Mascota;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Veterinaria)
  @JoinColumn({ name: 'veterinaria_id' })
  veterinaria: Veterinaria;
}
