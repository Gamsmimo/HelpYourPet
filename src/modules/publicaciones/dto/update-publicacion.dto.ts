import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePublicacionDto {
  @ApiPropertyOptional({ description: 'Contenido de la publicación' })
  @IsOptional()
  @IsString()
  contenido?: string;

  @ApiPropertyOptional({ description: 'Imagen en base64 o URL' })
  @IsOptional()
  @IsString()
  imagen?: string;
}
