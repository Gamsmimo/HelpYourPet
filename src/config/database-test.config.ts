import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseTestConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307') || 3307,
  username: process.env.DB_USERNAME || 'helppet',
  password: process.env.DB_PASSWORD || 'helppet123',
  database: process.env.DB_DATABASE || 'help_your_pet_test',
  autoLoadEntities: true,
  synchronize: false,
  logging: false,
  dropSchema: false,
};