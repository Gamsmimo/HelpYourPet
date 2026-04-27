import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilAdminController } from './controllers/perfil-admin.controller';
import { PerfilAdminService } from './services/perfil-admin.service';
import { PerfilAdmin } from './entities/perfil-admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilAdmin])],
  controllers: [PerfilAdminController],
  providers: [PerfilAdminService],
  exports: [PerfilAdminService, TypeOrmModule],
})
export class PerfilAdminModule {}


