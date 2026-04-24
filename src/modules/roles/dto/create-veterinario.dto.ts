import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateVeterinarioDto {
  @ApiProperty({ description: 'Nombres del veterinario', example: 'Carlos' })
  @IsString()
  nombres: string;

  @ApiProperty({ description: 'Apellidos del veterinario', example: 'Rodríguez López' })
  @IsString()
  apellidos: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'carlos.vet@example.com' })
  @IsEmail()
  correo: string;

  @ApiProperty({ description: 'Contraseña temporal', example: 'Temp123!', minLength: 6 })
  @IsString()
  @MinLength(6)
  contrasena: string;

  @ApiProperty({ description: 'Número de documento', example: '9876543210' })
  @IsString()
  num_documento: string;

  @ApiProperty({ description: 'Teléfono', example: '3019876543' })
  @IsString()
  telefono: string;

  @ApiProperty({ description: 'Dirección', example: 'Calle 456 #78-90', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({ description: 'Tipo de documento', example: 'CC', required: false })
  @IsOptional()
  @IsString()
  tipo_documento?: string;

  @ApiProperty({ description: 'Edad', example: 25, required: false })
  @IsOptional()
  @IsInt()
  edad?: number;

  @ApiProperty({ description: 'Especialidad', example: 'Cirugía', required: false })
  @IsOptional()
  @IsString()
  especialidad?: string;

  @ApiProperty({ description: 'Tarjeta profesional', example: 'TP-12345', required: false })
  @IsOptional()
  @IsString()
  tarjetaProfesional?: string;

  @ApiProperty({ description: 'Años de experiencia', example: 5, required: false })
  @IsOptional()
  @IsInt()
  experiencia?: number;

  @ApiProperty({ description: 'ID de la veterinaria', example: 1, required: false })
  @IsOptional()
  @IsInt()
  idVeterinaria?: number;

  @ApiProperty({ description: 'Estado activo', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
