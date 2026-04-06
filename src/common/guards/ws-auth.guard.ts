import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const token = client.handshake.auth.token;
    
    if (!token) {
      throw new WsException('Unauthorized: Missing token');
    }
    
    try {
      // Aquí deberías validar el token JWT
      // Por simplicidad, lo dejamos así
      return true;
    } catch (err) {
      throw new WsException('Unauthorized: Invalid token');
    }
  }
}