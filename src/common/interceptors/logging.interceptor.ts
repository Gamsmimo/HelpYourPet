import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const userAgent = request.get('User-Agent') || '';
    const ip = request.ip || request.connection.remoteAddress;

    const now = Date.now();
    
    // Loggear petición entrante
    this.logger.log(
      `Incoming Request: ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    // Si hay body, loggearlo (excepto passwords)
    if (body && Object.keys(body).length > 0) {
      const sanitizedBody = { ...body };
      if (sanitizedBody.password) {
        sanitizedBody.password = '[PROTECTED]';
      }
      this.logger.debug(`Request Body: ${JSON.stringify(sanitizedBody)}`);
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - now;
          this.logger.log(
            `Outgoing Response: ${method} ${url} - Status: Success - Duration: ${duration}ms`,
          );
          
          // Loggear respuesta en modo debug
          if (process.env.LOG_LEVEL === 'debug') {
            this.logger.debug(`Response Body: ${JSON.stringify(data)}`);
          }
        },
        error: (error) => {
          const duration = Date.now() - now;
          this.logger.error(
            `Outgoing Response: ${method} ${url} - Status: Error - Duration: ${duration}ms - Error: ${error.message}`,
          );
        },
      }),
    );
  }
}