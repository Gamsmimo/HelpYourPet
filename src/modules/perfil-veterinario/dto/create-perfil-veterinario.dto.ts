import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min } from 'class-validator';

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

  @ApiProperty({ description: 'Licencia profesional', example: 'VET-12345', required: false })
  @IsOptional()
  @IsString()
  licencia?: string;

  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  idUsuario: number;
}
