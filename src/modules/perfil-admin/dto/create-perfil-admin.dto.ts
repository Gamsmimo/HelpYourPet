import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreatePerfilAdminDto {
  @ApiProperty({ description: 'Cargo del administrador', example: 'Administrador General', required: false })
  @IsOptional()
  @IsString()
  cargo?: string;

  @ApiProperty({ description: 'Departamento', example: 'Sistemas', required: false })
  @IsOptional()
  @IsString()
  departamento?: string;

  @ApiProperty({ description: 'Permisos especiales', required: false })
  @IsOptional()
  @IsString()
  permisos?: string;

  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  idUsuario: number;
}
