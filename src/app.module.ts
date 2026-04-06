import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './cache/cache.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MetricsController } from './common/controllers/metrics.controller';
import { MonitoringModule } from './monitoring/monitoring.module';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { MetricsInterceptor } from './monitoring/metrics.interceptor';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { InitModule } from './modules/init/init.module';
import { MascotasModule } from './modules/mascotas/mascotas.module';
import { RolesModule } from './modules/roles/roles.module';
import { VeterinariasModule } from './modules/veterinarias/veterinarias.module';
import { AdopcionModule } from './modules/adopcion/adopcion.module';
import { ProductosModule } from './modules/productos/productos.module';
import { CitasModule } from './modules/citas/citas.module';
import { ServiciosModule } from './modules/servicios/servicios.module';
import { InventarioModule } from './modules/inventario/inventario.module';
import { CalificacionesModule } from './modules/calificaciones/calificaciones.module';
import { HistoriasClinicasModule } from './modules/historias-clinicas/historias-clinicas.module';
import { EmergenciasModule } from './modules/emergencias/emergencias.module';
import { CarritoModule } from './modules/carrito/carrito.module';
import { CarritoProductoModule } from './modules/carrito-producto/carrito-producto.module';
import { VentasModule } from './modules/ventas/ventas.module';
import { DetalleVentaModule } from './modules/detalle-venta/detalle-venta.module';
import { PagosModule } from './modules/pagos/pagos.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { NotificacionesModule } from './modules/notificaciones/notificaciones.module';
import { PerfilAdminModule } from './modules/perfil-admin/perfil-admin.module';
import { PerfilVeterinarioModule } from './modules/perfil-veterinario/perfil-veterinario.module';
import { TokenRecuperacionModule } from './modules/token-recuperacion/token-recuperacion.module';
import { ReportesMaltratoModule } from './modules/reportes-maltrato/reportes-maltrato.module';
import { VeterinariaVeterinarioModule } from './modules/veterinaria-veterinario/veterinaria-veterinario.module';
import { ViewsModule } from './modules/views/views.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadEntities: true,
        synchronize: false,
        logging: configService.get('database.logging'),
        extra: configService.get('database.extra'),
      }),
      inject: [ConfigService],
    }),
    
    CacheModule,
    
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    
    MonitoringModule,
    
    AuthModule,
    InitModule,
    UsuariosModule,
    MascotasModule,
    RolesModule,
    VeterinariasModule,
    AdopcionModule,
    ProductosModule,
    CitasModule,
    ServiciosModule,
    InventarioModule,
    CalificacionesModule,
    HistoriasClinicasModule,
    EmergenciasModule,
    CarritoModule,
    CarritoProductoModule,
    VentasModule,
    DetalleVentaModule,
    PagosModule,
    EventosModule,
    NotificacionesModule,
    PerfilAdminModule,
    PerfilVeterinarioModule,
    TokenRecuperacionModule,
    ReportesMaltratoModule,
    VeterinariaVeterinarioModule,
    ViewsModule,
  ],
  controllers: [AppController, MetricsController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware)
      .forRoutes('*');
  }
}