import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateComentarioDto {
  @ApiProperty({ description: 'ID de la publicación', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  idPublicacion: number;

  @ApiProperty({ description: 'ID del usuario que comenta', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  idUsuario: number;

  @ApiProperty({ description: 'Contenido del comentario', example: 'Excelente publicación!' })
  @IsString()
  @IsNotEmpty()
  contenido: string;
}
