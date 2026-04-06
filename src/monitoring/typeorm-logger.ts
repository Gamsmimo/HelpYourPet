import { Logger } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

export class TypeOrmLogger {
  private readonly logger = new Logger(TypeOrmLogger.name);

  constructor(private readonly prometheusService: any) {}

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const start = Date.now();
    
    // Simular duración (en una implementación real, TypeORM proporciona esto)
    setTimeout(() => {
      const duration = (Date.now() - start) / 1000;
      const queryType = this.getQueryType(query);
      
      this.prometheusService.observeDatabaseQueryDuration(queryType, duration);
      
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug(`Query: ${query}`);
        this.logger.debug(`Parameters: ${JSON.stringify(parameters)}`);
        this.logger.debug(`Duration: ${duration}s`);
      }
    }, 0);
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.error(`Query error: ${error}`);
    this.logger.error(`Query: ${query}`);
    this.logger.error(`Parameters: ${JSON.stringify(parameters)}`);
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.warn(`Slow query detected: ${time}ms`);
    this.logger.warn(`Query: ${query}`);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.log(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.log(message);
  }

  private getQueryType(query: string): string {
    const upperQuery = query.toUpperCase().trim();
    if (upperQuery.startsWith('SELECT')) return 'SELECT';
    if (upperQuery.startsWith('INSERT')) return 'INSERT';
    if (upperQuery.startsWith('UPDATE')) return 'UPDATE';
    if (upperQuery.startsWith('DELETE')) return 'DELETE';
    return 'OTHER';
  }
}