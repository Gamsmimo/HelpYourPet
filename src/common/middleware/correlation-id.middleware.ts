import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CorrelationIdMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
    
    // Agregar correlation ID a la request
    req['correlationId'] = correlationId;
    
    // Agregar correlation ID a los headers de respuesta
    res.setHeader('X-Correlation-ID', correlationId);
    
    // Agregar correlation ID al contexto del logger
    req['logger'] = this.logger;
    
    next();
  }
}