import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateVeterinariaDto {
  @ApiProperty({ description: 'Nombre de la veterinaria', example: 'Veterinaria Central' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'contacto@vetcentral.com', required: false })
  @IsOptional()
  @IsEmail()
  correo?: string;

  @ApiProperty({ description: 'Descripción', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'Dirección', example: 'Calle 100 #50-25', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({ description: 'Estado', example: 'Activo', required: false })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ description: 'Horario', example: 'Lun-Vie 8am-6pm', required: false })
  @IsOptional()
  @IsString()
  horario?: string;

  @ApiProperty({ description: 'RUT', example: '900123456-7', required: false })
  @IsOptional()
  @IsString()
  rut?: string;

  @ApiProperty({ description: 'Teléfono', example: '3001234567', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;
}
