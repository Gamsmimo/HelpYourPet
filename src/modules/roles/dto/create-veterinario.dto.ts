import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

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

  @ApiProperty({ description: 'ID de la veterinaria', example: 1 })
  @IsOptional()
  @IsString()
  idVeterinaria?: number;
}
