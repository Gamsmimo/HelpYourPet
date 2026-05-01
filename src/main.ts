import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { logger } from './config/logger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { CustomValidationPipe } from './common/pipes/validation.pipe';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import * as path from 'path';
import { initializeTracing } from './monitoring/tracing';
import { PrometheusService } from './monitoring/prometheus.service';
import { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';

// Inicializar tracing
const sdk = initializeTracing();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
    bodyParser: false,
  });

  const configService = app.get(ConfigService);
  const prometheusService = app.get(PrometheusService);

  // Habilitar archivos estáticos
  const uploadsPath = path.join(__dirname, '..', 'uploads');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  // Habilitar archivos estáticos del frontend
  const publicPath = path.join(__dirname, '..', 'public');
  app.useStaticAssets(publicPath, {
    prefix: '/',
  });

  // Middleware
  app.use(cookieParser());
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));
  app.use(compression());
  
  // Configuración
  app.enableCors(configService.get('cors'));
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('HelpYourPet API')
    .setDescription('API completa para la plataforma de servicios veterinarios HelpYourPet')
    .setVersion('2.0.0')
    .addTag('auth', 'Autenticación y autorización')
    .addTag('usuarios', 'Gestión de usuarios')
    .addTag('roles', 'Gestión de roles')
    .addTag('mascotas', 'Gestión de mascotas')
    .addTag('adopcion', 'Proceso de adopción de mascotas')
    .addTag('veterinarias', 'Gestión de veterinarias')
    .addTag('citas', 'Citas veterinarias')
    .addTag('servicios', 'Servicios veterinarios')
    .addTag('calificaciones', 'Calificaciones y reseñas')
    .addTag('historias-clinicas', 'Historias clínicas')
    .addTag('emergencias', 'Emergencias veterinarias')
    .addTag('productos', 'Catálogo de productos')
    .addTag('inventario', 'Inventario de productos')
    .addTag('carrito', 'Carrito de compras')
    .addTag('carrito-producto', 'Items del carrito')
    .addTag('ventas', 'Ventas')
    .addTag('detalle-venta', 'Detalles de venta')
    .addTag('pagos', 'Pagos')
    .addTag('eventos', 'Eventos de veterinarias')
    .addTag('notificaciones', 'Notificaciones del sistema')
    .addTag('perfil-admin', 'Perfil de administradores')
    .addTag('perfil-veterinario', 'Perfil de veterinarios')
    .addTag('token-recuperacion', 'Tokens de recuperación')
    .addTag('reportes-maltrato', 'Reportes de maltrato')
    .addTag('veterinaria-veterinario', 'Asignación veterinaria-veterinario')
    .addTag('monitoring', 'Monitoreo y métricas')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese su token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Iniciar servidor
  const port = configService.get<number>('port') || 3000;
  await app.listen(port);

  // Logging de información
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api`);
  console.log(`Health checks:`);
  console.log(`  - Health: http://localhost:${port}/health`);
  console.log(`  - Metrics: http://localhost:${port}/health/metrics`);
  console.log(`  - Tracing: http://localhost:9464/metrics`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
}

bootstrap().then(() => {
  console.log('Application started successfully');
}).catch((error) => {
  console.error('Failed to start application:', error);
  sdk.shutdown();
});
