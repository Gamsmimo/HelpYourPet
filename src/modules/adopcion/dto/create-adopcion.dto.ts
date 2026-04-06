import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateAdopcionDto {
  @ApiProperty({ description: 'Contacto del adoptante', example: '3001234567' })
  @IsString()
  contacto: string;

  @ApiProperty({ description: 'Descripción', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'Edad de la mascota', example: 3, required: false })
  @IsOptional()
  @IsInt()
  edad?: number;

  @ApiProperty({ description: 'Estado', example: 'Pendiente', required: false })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ description: 'Fecha de publicación', required: false })
  @IsOptional()
  @IsDateString()
  fechaPublicacion?: Date;

  @ApiProperty({ description: 'Género', example: 'Macho', required: false })
  @IsOptional()
  @IsString()
  genero?: string;

  @ApiProperty({ description: 'URL de imagen', required: false })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiProperty({ description: 'Nombre de la mascota', example: 'Firulais' })
  @IsString()
  nombreMascota: string;

  @ApiProperty({ description: 'Raza', required: false })
  @IsOptional()
  @IsString()
  raza?: string;

  @ApiProperty({ description: 'Tamaño', required: false })
  @IsOptional()
  @IsString()
  tamano?: string;

  @ApiProperty({ description: 'Tipo de mascota', example: 'Perro' })
  @IsString()
  tipoMascota: string;

  @ApiProperty({ description: 'ID de la mascota', required: false })
  @IsOptional()
  @IsInt()
  idMascota?: number;

  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  usuario_id: number;

  @ApiProperty({ description: 'ID de la veterinaria', required: false })
  @IsOptional()
  @IsInt()
  veterinaria_id?: number;
}
