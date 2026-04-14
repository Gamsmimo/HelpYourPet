import { IsString, IsNotEmpty, IsOptional, MaxLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicacionDto {
  @ApiProperty({ description: 'ID del usuario que crea la publicación', example: 1 })
  @IsNumber()
  idUsuario: number;

  @ApiProperty({ description: 'Contenido de la publicación', example: 'Mi mascota es muy linda!' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  contenido: string;

  @ApiProperty({ description: 'URL de la imagen (opcional)', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  imagen?: string;
}
