import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min, IsBoolean } from 'class-validator';

export class CreatePerfilVeterinarioDto {
  @ApiProperty({ description: 'Especialidad del veterinario', example: 'Cirugía', required: false })
  @IsOptional()
  @IsString()
  especialidad?: string;

  @ApiProperty({ description: 'Años de experiencia', example: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  experiencia?: number;

  @ApiProperty({ description: 'Tarjeta profesional', example: 'TP-12345', required: false })
  @IsOptional()
  @IsString()
  tarjetaProfesional?: string;

  @ApiProperty({ description: 'Estado activo del veterinario', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ description: 'ID de la veterinaria asociada', required: false })
  @IsOptional()
  @IsInt()
  idVeterinaria?: number;
}
