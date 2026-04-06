import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsInt, IsOptional } from 'class-validator';

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

  @ApiProperty({ description: 'Documento de identidad', example: '1234567890', required: false })
  @IsOptional()
  @IsString()
  documento?: string;

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
