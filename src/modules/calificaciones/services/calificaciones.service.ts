import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from '../entities/calificacion.entity';
import { CreateCalificacionDto } from '../dto/create-calificacion.dto';
import { UpdateCalificacionDto } from '../dto/update-calificacion.dto';

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
    return this.calificacionesRepository.find({ relations: ['usuario', 'veterinaria'] });
  }

  async findByVeterinaria(idVeterinaria: number): Promise<Calificacion[]> {
    return this.calificacionesRepository.find({
      where: { idVeterinaria },
      relations: ['usuario', 'veterinaria'],
    });
  }

  async findOne(id: number): Promise<Calificacion> {
    const calificacion = await this.calificacionesRepository.findOne({
      where: { id },
      relations: ['usuario', 'veterinaria'],
    });
    if (!calificacion) {
      throw new NotFoundException(`CalificaciÃ³n con ID ${id} no encontrada`);
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

