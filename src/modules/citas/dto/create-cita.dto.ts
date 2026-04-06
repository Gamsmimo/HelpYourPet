import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateCitaDto {
  @ApiProperty({ description: 'Motivo de la cita', example: 'Consulta general' })
  @IsString()
  motivo: string;

  @ApiProperty({ description: 'Descripción', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'Fecha y hora', example: '2024-03-25T10:00:00' })
  @IsDateString()
  fechaHora: Date;

  @ApiProperty({ description: 'Estado', example: 'Pendiente', required: false })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ description: 'ID de la mascota' })
  @IsInt()
  idMascota: number;

  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ description: 'ID de la veterinaria' })
  @IsInt()
  idVeterinaria: number;
}
