import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicacionDto {
  @ApiProperty({ description: 'ID del usuario que crea la publicación', example: 1 })
  @IsNumber()
  idUsuario: number;

  @ApiProperty({ description: 'Contenido de la publicación', example: 'Mi mascota es muy linda!' })
  @IsString()
  @IsNotEmpty()
  contenido: string;

  @ApiProperty({ description: 'Imagen en base64 o URL (opcional)', required: false })
  @IsOptional()
  @IsString()
  imagen?: string;
}
