import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateEventoDto {
  @ApiProperty({ description: 'Nombre del evento', example: 'Jornada de Vacunación' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Descripción', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'Fecha del evento', example: '2024-04-15' })
  @IsDateString()
  fecha: Date;

  @ApiProperty({ description: 'Lugar', example: 'Auditorio Principal', required: false })
  @IsOptional()
  @IsString()
  lugar?: string;

  @ApiProperty({ description: 'ID de la veterinaria' })
  @IsInt()
  idVeterinaria: number;
}
