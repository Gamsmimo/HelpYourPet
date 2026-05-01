import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usuariosService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token: string | null = null;
          // Primero intentar desde cookie
          if (request && request.cookies) {
            token = request.cookies['jwt'] || null;
          }
          // Fallback a Authorization header para compatibilidad
          if (!token) {
            const headerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
            token = headerToken || null;
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'default-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    const usuario = await this.usuariosService.findOne(payload.sub);
    
    if (!usuario) {
      throw new UnauthorizedException('Token invÃ¡lido');
    }

    if (!usuario.estado) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return {
      id: payload.sub,
      correo: payload.correo,
      idRol: payload.idRol,
      nombreRol: payload.nombreRol,
    };
  }
}

