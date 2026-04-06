import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateVentaDto {
  @ApiProperty({ description: 'Total de la venta', example: 150000 })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ description: 'Fecha de la venta', required: false })
  @IsOptional()
  @IsDateString()
  fecha?: Date;

  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  idUsuario: number;
}
