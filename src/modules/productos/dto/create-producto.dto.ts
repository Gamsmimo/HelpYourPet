import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductoDto {
  @ApiProperty({ description: 'Nombre del producto', example: 'Alimento Premium' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Categoría', example: 'Alimento', required: false })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({ description: 'Descripción', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'Precio', example: 50000 })
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty({ description: 'URL de imagen', required: false })
  @IsOptional()
  @IsString()
  imagen?: string;
}
