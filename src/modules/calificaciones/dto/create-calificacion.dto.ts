import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class CreateCalificacionDto {
  @ApiProperty({ description: 'Puntuación', example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  puntuacion: number;

  @ApiProperty({ description: 'Comentario', example: 'Excelente servicio', required: false })
  @IsOptional()
  @IsString()
  comentario?: string;

  @ApiProperty({ description: 'Estado', example: 'Aprobado', required: false })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ description: 'Fecha', required: false })
  @IsOptional()
  @IsDateString()
  fecha?: Date;

  @ApiProperty({ description: 'ID del servicio', required: false })
  @IsOptional()
  @IsInt()
  idServicio?: number;

  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ description: 'ID del veterinario', required: false })
  @IsOptional()
  @IsInt()
  idVeterinario?: number;
}
