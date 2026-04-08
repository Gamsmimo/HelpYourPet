import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateVeterinariaDto {
  @ApiProperty({ description: 'Nombre de la veterinaria', example: 'Veterinaria Central' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'contacto@vetcentral.com', required: false })
  @IsOptional()
  @IsEmail()
  correo?: string;

  @ApiProperty({ description: 'Servicios ofrecidos', required: false })
  @IsOptional()
  @IsString()
  serviciosOfrecidos?: string;

  @ApiProperty({ description: 'Dirección', example: 'Calle 100 #50-25', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({ description: 'Estado', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @ApiProperty({ description: 'Horario de atención', example: 'Lun-Vie 8am-6pm', required: false })
  @IsOptional()
  @IsString()
  horarioAtencion?: string;

  @ApiProperty({ description: 'Calificación promedio', example: 4.5, required: false })
  @IsOptional()
  @IsNumber()
  calificacionPromedio?: number;

  @ApiProperty({ description: 'Foto', required: false })
  @IsOptional()
  @IsString()
  foto?: string;

  @ApiProperty({ description: 'Teléfono', example: '3001234567', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;
}
