import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';

describe('Database Configuration', () => {
  let module: TestingModule;
  let configService: ConfigService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
          envFilePath: '.env',
        }),
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should have database configuration', () => {
    expect(configService.get('database.host')).toBeDefined();
    expect(configService.get('database.port')).toBeDefined();
    expect(configService.get('database.username')).toBeDefined();
    expect(configService.get('database.password')).toBeDefined();
    expect(configService.get('database.database')).toBeDefined();
  });
});