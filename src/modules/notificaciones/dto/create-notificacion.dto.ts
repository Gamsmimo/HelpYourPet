import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateNotificacionDto {
  @ApiProperty({ description: 'Mensaje de la notificación' })
  @IsString()
  mensaje: string;

  @ApiProperty({ description: 'Tipo de notificación', example: 'Recordatorio' })
  @IsString()
  tipo: string;

  @ApiProperty({ description: 'Estado', example: 'No leída', required: false })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ description: 'Fecha', required: false })
  @IsOptional()
  @IsDateString()
  fecha?: Date;

  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  idUsuario: number;
}
