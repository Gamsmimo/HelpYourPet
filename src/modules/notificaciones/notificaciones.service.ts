import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private notificacionesRepository: Repository<Notificacion>,
  ) {}

  async create(createNotificacionDto: CreateNotificacionDto): Promise<Notificacion> {
    const notificacion = this.notificacionesRepository.create(createNotificacionDto);
    return this.notificacionesRepository.save(notificacion);
  }

  async findAll(): Promise<Notificacion[]> {
    return this.notificacionesRepository.find({ relations: ['usuario'] });
  }

  async findByUsuario(idUsuario: number): Promise<Notificacion[]> {
    return this.notificacionesRepository.find({
      where: { idUsuario },
      relations: ['usuario'],
    });
  }

  async findOne(id: number): Promise<Notificacion> {
    const notificacion = await this.notificacionesRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!notificacion) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada`);
    }
    return notificacion;
  }

  async update(id: number, updateNotificacionDto: UpdateNotificacionDto): Promise<Notificacion> {
    const notificacion = await this.findOne(id);
    Object.assign(notificacion, updateNotificacionDto);
    return this.notificacionesRepository.save(notificacion);
  }

  async remove(id: number): Promise<void> {
    const notificacion = await this.findOne(id);
    await this.notificacionesRepository.remove(notificacion);
  }
}
