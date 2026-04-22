import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, MinLength, MaxLength, Min } from 'class-validator';

export class CreateMascotaDto {
  @ApiProperty({ description: 'Nombre de la mascota', example: 'Firulais' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  nombre: string;

  @ApiProperty({ description: 'Especie', example: 'Perro' })
  @IsString()
  @MaxLength(255)
  especie: string;

  @ApiProperty({ description: 'Raza', example: 'Labrador', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  raza?: string;

  @ApiProperty({ description: 'Edad', example: 3, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  edad?: number;

  @ApiProperty({ description: 'Sexo/Género', example: 'Macho', required: false })
  @IsOptional()
  @IsString()
  sexo?: string;

  @ApiProperty({ description: 'Descripción', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'URL de la foto', required: false })
  @IsOptional()
  @IsString()
  foto?: string;

  @ApiProperty({ description: 'Tamaño', example: 'Mediano', required: false })
  @IsOptional()
  @IsString()
  tamano?: string;

  @ApiProperty({ description: 'Unidad de edad', example: 'Años', required: false })
  @IsOptional()
  @IsString()
  unidadEdad?: string;

  @ApiProperty({ description: 'ID del usuario dueño' })
  @IsInt()
  idUsuario: number;
}
