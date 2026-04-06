import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    description: 'Correo electrónico del usuario', 
    example: 'usuario@example.com' 
  })
  @IsEmail()
  correo: string;

  @ApiProperty({ 
    description: 'Contraseña del usuario', 
    example: 'Password123!',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  contrasena: string;
}
