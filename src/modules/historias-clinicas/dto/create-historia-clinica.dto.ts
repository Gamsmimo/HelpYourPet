import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateHistoriaClinicaDto {
  @ApiProperty({ description: 'Diagnóstico', example: 'Infección respiratoria' })
  @IsString()
  diagnostico: string;

  @ApiProperty({ description: 'Tratamiento', example: 'Antibióticos por 7 días' })
  @IsString()
  tratamiento: string;

  @ApiProperty({ description: 'Observaciones', required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiProperty({ description: 'Fecha de la consulta', required: false })
  @IsOptional()
  @IsDateString()
  fecha?: Date;

  @ApiProperty({ description: 'ID de la mascota' })
  @IsInt()
  idMascota: number;

  @ApiProperty({ description: 'ID del veterinario' })
  @IsInt()
  idVeterinario: number;
}
