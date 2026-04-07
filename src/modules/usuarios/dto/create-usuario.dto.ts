import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsInt, IsOptional, MinLength, MaxLength, Min, Max, IsEnum, IsBoolean } from 'class-validator';

export enum TipoDocumento {
  CC = 'CC',
  TI = 'TI',
  CE = 'CE',
  PA = 'PA',
}

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nombres del usuario', example: 'Juan Carlos' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombres: string;

  @ApiProperty({ description: 'Apellidos del usuario', example: 'García Martínez' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  apellidos: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'usuario@example.com' })
  @IsEmail()
  @MaxLength(150)
  correo: string;

  @ApiProperty({ description: 'Contraseña', example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'Tipo de documento', enum: TipoDocumento, example: 'CC', required: false })
  @IsOptional()
  @IsEnum(TipoDocumento)
  tipo_documento?: TipoDocumento;

  @ApiProperty({ description: 'Número de documento', example: '1234567890', required: false })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  num_documento?: string;

  @ApiProperty({ description: 'Edad', example: 25, required: false })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(120)
  edad?: number;

  @ApiProperty({ description: 'Teléfono', example: '3001234567', required: false })
  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  telefono?: string;

  @ApiProperty({ description: 'Dirección', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({ description: 'URL de imagen', required: false })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiProperty({ description: 'Estado activo', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @ApiProperty({ description: 'Estado activo (alias)', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiProperty({ description: 'ID del rol', required: false })
  @IsOptional()
  @IsInt()
  rol_id?: number;
}
