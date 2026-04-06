import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, IsOptional, Min } from 'class-validator';

export class CreateServicioDto {
  @ApiProperty({ description: 'Nombre del servicio', example: 'Consulta general' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Descripción', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'Precio', example: 50000 })
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty({ description: 'Duración en minutos', example: 30, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  duracion?: number;

  @ApiProperty({ description: 'ID de la veterinaria' })
  @IsInt()
  idVeterinaria: number;
}
