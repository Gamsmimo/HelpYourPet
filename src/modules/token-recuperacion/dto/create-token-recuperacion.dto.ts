import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDateString } from 'class-validator';

export class CreateTokenRecuperacionDto {
  @ApiProperty({ description: 'Token de recuperación' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'Fecha de expiración', example: '2024-03-25T23:59:59' })
  @IsDateString()
  fechaExpiracion: Date;

  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  idUsuario: number;
}
