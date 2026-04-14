import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicacionDto {
  @ApiProperty({ description: 'Contenido de la publicación', example: 'Mi mascota es muy linda!' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  contenido: string;

  @ApiProperty({ description: 'URL de la imagen (opcional)', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imagen?: string;
}
