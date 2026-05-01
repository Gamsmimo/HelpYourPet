import { Injectable, UnauthorizedException, ConflictException, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import type { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto, @Res({ passthrough: true }) response?: Response) {
    try {
      // Verificar si el correo ya existe
      const existingUser = await this.usuariosService.findByCorreo(registerDto.correo);
      if (existingUser) {
        throw new ConflictException('El correo ya está registrado');
      }

      // Crear usuario con rol por defecto (Usuario = 3)
      const usuario = await this.usuariosService.create({
        nombres: registerDto.nombre,
        apellidos: registerDto.apellidos,
        correo: registerDto.correo,
        password: registerDto.contrasena,
        telefono: registerDto.telefono || '',
        direccion: registerDto.direccion || '',
        tipo_documento: registerDto.tipo_documento,
        num_documento: registerDto.num_documento,
        edad: registerDto.edad,
        rol_id: registerDto.idRol || 3,
        estado: true,
      });

      // Generar token
      const payload: JwtPayload = {
        sub: usuario.id,
        correo: usuario.correo,
        idRol: usuario.rol_id,
        nombreRol: usuario.rol?.nombre || 'Usuario',
      };

      const token = this.jwtService.sign(payload);

      // Setear cookie httpOnly
      if (response) {
        response.cookie('jwt', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000, // 24 horas
        });
      }

      return {
        access_token: token,
        user: {
          id: usuario.id,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          correo: usuario.correo,
          rol_id: usuario.rol_id,
          rol: usuario.rol?.nombre,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: LoginDto, @Res({ passthrough: true }) response?: Response) {
    try {
      // Buscar usuario por correo
      const usuario = await this.usuariosService.findByCorreo(loginDto.correo);

      if (!usuario) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Verificar si el usuario está activo
      if (!usuario.estado) {
        throw new UnauthorizedException('Usuario inactivo');
      }

      // Verificar contraseña
      const usuarioConPassword = await this.usuariosService.findOneWithPassword(usuario.id);

      if (!usuarioConPassword.password || !loginDto.contrasena) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const isPasswordValid = await bcrypt.compare(loginDto.contrasena, usuarioConPassword.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Generar token
      const payload: JwtPayload = {
        sub: usuario.id,
        correo: usuario.correo,
        idRol: usuario.rol_id,
        nombreRol: usuario.rol?.nombre || 'Usuario',
      };

      const token = this.jwtService.sign(payload);

      // Setear cookie httpOnly
      if (response) {
        response.cookie('jwt', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000, // 24 horas
        });
      }

      return {
        access_token: token,
        user: {
          id: usuario.id,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          correo: usuario.correo,
          rol_id: usuario.rol_id,
          rol: usuario.rol?.nombre,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async validateUser(id: number) {
    return this.usuariosService.findOne(id);
  }

  async logout(@Res({ passthrough: true }) response?: Response) {
    if (response) {
      response.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }
    return { message: 'Logout successful' };
  }
}


