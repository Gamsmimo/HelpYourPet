import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateRolDto {
  @ApiProperty({ description: 'Nombre del rol', example: 'ADMIN' })
  @IsString()
  @MaxLength(50)
  nombre: string;

  @ApiProperty({ description: 'Descripción del rol', example: 'Administrador del sistema', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;
}
