import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicacionDto {
  @ApiProperty({
    description: 'ID del usuario (opcional, se ignora y se toma del token JWT)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  idUsuario?: number;

  @ApiProperty({ description: 'Contenido de la publicación', example: 'Mi mascota es muy linda!' })
  @IsString()
  @IsNotEmpty()
  contenido: string;

  @ApiProperty({ description: 'Imagen en base64 o URL (opcional)', required: false })
  @IsOptional()
  @IsString()
  imagen?: string;
}
