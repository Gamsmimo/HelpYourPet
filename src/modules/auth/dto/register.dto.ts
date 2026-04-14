import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsInt, IsOptional, IsEnum } from 'class-validator';

export enum TipoDocumento {
  CC = 'CC',
  TI = 'TI',
  CE = 'CE',
  PA = 'PA',
}

export class RegisterDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Apellidos del usuario', example: 'Pérez García' })
  @IsString()
  apellidos: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'juan.perez@example.com' })
  @IsEmail()
  correo: string;

  @ApiProperty({ description: 'Contraseña', example: 'Password123!', minLength: 6 })
  @IsString()
  @MinLength(6)
  contrasena: string;

  @ApiProperty({ description: 'Tipo de documento', enum: TipoDocumento, example: 'CC', required: false })
  @IsOptional()
  @IsEnum(TipoDocumento)
  tipo_documento?: TipoDocumento;

  @ApiProperty({ description: 'Número de documento', example: '1234567890', required: false })
  @IsOptional()
  @IsString()
  num_documento?: string;

  @ApiProperty({ description: 'Edad', example: 25, required: false })
  @IsOptional()
  @IsInt()
  edad?: number;

  @ApiProperty({ description: 'Teléfono', example: '3001234567', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ description: 'Dirección', example: 'Calle 123 #45-67', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({ description: 'ID del rol', example: 2, default: 2 })
  @IsOptional()
  @IsInt()
  idRol?: number;
}
