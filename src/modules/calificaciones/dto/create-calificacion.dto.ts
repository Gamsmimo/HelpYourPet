import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class CreateCalificacionDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ description: 'ID de la veterinaria' })
  @IsInt()
  idVeterinaria: number;

  @ApiProperty({ description: 'Puntuación', example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  puntuacion: number;

  @ApiProperty({ description: 'Comentario', example: 'Excelente servicio', required: false })
  @IsOptional()
  @IsString()
  comentario?: string;

  @ApiProperty({ description: 'Fecha de calificación', required: false })
  @IsOptional()
  @IsDateString()
  fechaCalificacion?: Date;
}
