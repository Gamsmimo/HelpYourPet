import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenRecuperacionController } from './controllers/token-recuperacion.controller';
import { TokenRecuperacionService } from './services/token-recuperacion.service';
import { TokenRecuperacion } from './entities/token-recuperacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TokenRecuperacion])],
  controllers: [TokenRecuperacionController],
  providers: [TokenRecuperacionService],
  exports: [TokenRecuperacionService, TypeOrmModule],
})
export class TokenRecuperacionModule {}


