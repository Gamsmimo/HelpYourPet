import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateInventarioDto {
  @ApiProperty({ description: 'Cantidad disponible', example: 100 })
  @IsInt()
  @Min(0)
  cantidad: number;

  @ApiProperty({ description: 'Fecha de actualización', required: false })
  @IsOptional()
  @IsDateString()
  fechaActualizacion?: Date;

  @ApiProperty({ description: 'ID del producto' })
  @IsInt()
  idProducto: number;

  @ApiProperty({ description: 'ID de la veterinaria' })
  @IsInt()
  idVeterinaria: number;
}
