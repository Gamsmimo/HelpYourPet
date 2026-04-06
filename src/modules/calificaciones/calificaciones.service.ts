import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from './entities/calificacion.entity';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';

@Injectable()
export class CalificacionesService {
  constructor(
    @InjectRepository(Calificacion)
    private calificacionesRepository: Repository<Calificacion>,
  ) {}

  async create(createCalificacionDto: CreateCalificacionDto): Promise<Calificacion> {
    const calificacion = this.calificacionesRepository.create(createCalificacionDto);
    return this.calificacionesRepository.save(calificacion);
  }

  async findAll(): Promise<Calificacion[]> {
    return this.calificacionesRepository.find({ relations: ['servicio', 'usuario', 'veterinario'] });
  }

  async findByServicio(idServicio: number): Promise<Calificacion[]> {
    return this.calificacionesRepository.find({
      where: { idServicio },
      relations: ['servicio', 'usuario', 'veterinario'],
    });
  }

  async findOne(id: number): Promise<Calificacion> {
    const calificacion = await this.calificacionesRepository.findOne({
      where: { id },
      relations: ['servicio', 'usuario', 'veterinario'],
    });
    if (!calificacion) {
      throw new NotFoundException(`Calificación con ID ${id} no encontrada`);
    }
    return calificacion;
  }

  async update(id: number, updateCalificacionDto: UpdateCalificacionDto): Promise<Calificacion> {
    const calificacion = await this.findOne(id);
    Object.assign(calificacion, updateCalificacionDto);
    return this.calificacionesRepository.save(calificacion);
  }

  async remove(id: number): Promise<void> {
    const calificacion = await this.findOne(id);
    await this.calificacionesRepository.remove(calificacion);
  }
}
