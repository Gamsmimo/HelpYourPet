import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private serviciosRepository: Repository<Servicio>,
  ) {}

  async create(createServicioDto: CreateServicioDto): Promise<Servicio> {
    const servicio = this.serviciosRepository.create(createServicioDto);
    return this.serviciosRepository.save(servicio);
  }

  async findAll(): Promise<Servicio[]> {
    return this.serviciosRepository.find({ relations: ['veterinaria'] });
  }

  async findByVeterinaria(idVeterinaria: number): Promise<Servicio[]> {
    return this.serviciosRepository.find({
      where: { idVeterinaria },
      relations: ['veterinaria'],
    });
  }

  async findOne(id: number): Promise<Servicio> {
    const servicio = await this.serviciosRepository.findOne({
      where: { id },
      relations: ['veterinaria'],
    });
    if (!servicio) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    return servicio;
  }

  async update(id: number, updateServicioDto: UpdateServicioDto): Promise<Servicio> {
    const servicio = await this.findOne(id);
    Object.assign(servicio, updateServicioDto);
    return this.serviciosRepository.save(servicio);
  }

  async remove(id: number): Promise<void> {
    const servicio = await this.findOne(id);
    await this.serviciosRepository.remove(servicio);
  }
}
