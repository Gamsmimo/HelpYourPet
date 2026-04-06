import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateVeterinariaVeterinarioDto {
  @ApiProperty({ description: 'ID de la veterinaria' })
  @IsInt()
  idVeterinaria: number;

  @ApiProperty({ description: 'ID del veterinario' })
  @IsInt()
  idVeterinario: number;

  @ApiProperty({ description: 'Fecha de asignación', required: false })
  @IsOptional()
  @IsDateString()
  fechaAsignacion?: Date;
}
