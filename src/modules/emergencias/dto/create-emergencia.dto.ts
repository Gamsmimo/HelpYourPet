import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateEmergenciaDto {
  @ApiProperty({ description: 'Tipo de emergencia', example: 'Accidente' })
  @IsString()
  tipo: string;

  @ApiProperty({ description: 'Descripción', example: 'Mascota atropellada' })
  @IsString()
  descripcion: string;

  @ApiProperty({ description: 'Fecha y hora', example: '2024-03-25T15:30:00' })
  @IsDateString()
  fechaHora: Date;

  @ApiProperty({ description: 'Estado', example: 'En proceso', required: false })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ description: 'ID de la mascota' })
  @IsInt()
  idMascota: number;

  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ description: 'ID de la veterinaria', required: false })
  @IsOptional()
  @IsInt()
  idVeterinaria?: number;
}
