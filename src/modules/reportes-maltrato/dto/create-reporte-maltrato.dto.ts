import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateReporteMaltratoDto {
  @ApiProperty({ description: 'Descripción del reporte' })
  @IsString()
  descripcion: string;

  @ApiProperty({ description: 'Ubicación del incidente' })
  @IsString()
  ubicacion: string;

  @ApiProperty({ description: 'Estado', example: 'Pendiente', required: false })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ description: 'Fecha', required: false })
  @IsOptional()
  @IsDateString()
  fecha?: Date;

  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  idUsuario: number;
}
