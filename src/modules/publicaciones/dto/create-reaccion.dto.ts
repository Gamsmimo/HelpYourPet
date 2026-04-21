import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReaccionDto {
  @ApiProperty({ description: 'ID de la publicación', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  idPublicacion: number;

  @ApiProperty({ description: 'ID del usuario que reacciona', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  idUsuario: number;

  @ApiProperty({ description: 'Tipo de reacción', example: 'like', required: false })
  @IsString()
  @IsOptional()
  tipo?: string;
}
