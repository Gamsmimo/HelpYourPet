import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    console.log('Register DTO:', registerDto);
    
    try {
      // Verificar si el correo ya existe
      const existingUser = await this.usuariosService.findByCorreo(registerDto.correo);
      if (existingUser) {
        throw new ConflictException('El correo ya está registrado');
      }

    // Crear usuario con rol por defecto (Usuario = 2)
    console.log('Creando usuario con datos:', {
      nombres: registerDto.nombre,
      apellidos: registerDto.apellidos,
      correo: registerDto.correo,
      rol_id: registerDto.idRol || 2,
    });
    
    const usuario = await this.usuariosService.create({
      nombres: registerDto.nombre,
      apellidos: registerDto.apellidos,
      correo: registerDto.correo,
      password: registerDto.contrasena,
      num_documento: registerDto.documento || '0000000000',
      telefono: registerDto.telefono || '0000000',
      direccion: registerDto.direccion || '',
      tipo_documento: 'CC' as any,
      edad: 18,
      rol_id: registerDto.idRol || 3,
      activo: true,
    });
    
    console.log('Usuario creado:', usuario);

    // Generar token
    const payload: JwtPayload = {
      sub: usuario.id,
      correo: usuario.correo,
      idRol: usuario.rol_id,
      nombreRol: usuario.rol?.nombre || 'Usuario',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: usuario.rol?.nombre,
      },
    };
    } catch (error) {
      console.error('Error en register:', error);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    console.log('Login DTO:', loginDto);
    
    try {
      // Buscar usuario por correo
      const usuario = await this.usuariosService.findByCorreo(loginDto.correo);
      console.log('Usuario encontrado:', usuario);
      
      if (!usuario) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Verificar contraseña
    const usuarioConPassword = await this.usuariosService.findOneWithPassword(usuario.id);
    console.log('Usuario con password:', { 
      id: usuarioConPassword.id, 
      password: usuarioConPassword.password ? 'exists' : 'undefined' 
    });
    console.log('Contraseña a comparar:', loginDto.contrasena);
    
    if (!usuarioConPassword.password || !loginDto.contrasena) {
      throw new Error('Password o contraseña undefined');
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

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: usuario.rol?.nombre,
      },
    };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async validateUser(id: number) {
    return this.usuariosService.findOne(id);
  }
}
