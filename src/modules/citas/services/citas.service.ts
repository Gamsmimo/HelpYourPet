import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from '../entities/cita.entity';
import { CreateCitaDto } from '../dto/create-cita.dto';
import { UpdateCitaDto } from '../dto/update-cita.dto';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private citasRepository: Repository<Cita>,
  ) {}

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    const cita = this.citasRepository.create(createCitaDto);
    return this.citasRepository.save(cita);
  }

  async findAll(): Promise<Cita[]> {
    return this.citasRepository.find({ relations: ['mascota', 'usuario', 'veterinaria'] });
  }

  async findByEstado(estado: string): Promise<Cita[]> {
    return this.citasRepository.find({
      where: { estado },
      relations: ['mascota', 'usuario', 'veterinaria'],
    });
  }

  async findByUsuario(idUsuario: number): Promise<Cita[]> {
    return this.citasRepository.find({
      where: { idUsuario },
      relations: ['mascota', 'usuario', 'veterinaria'],
    });
  }

  async findOne(id: number): Promise<Cita> {
    const cita = await this.citasRepository.findOne({
      where: { id },
      relations: ['mascota', 'usuario', 'veterinaria'],
    });
    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }
    return cita;
  }

  async update(id: number, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    const cita = await this.findOne(id);
    Object.assign(cita, updateCitaDto);
    return this.citasRepository.save(cita);
  }

  async remove(id: number): Promise<void> {
    const cita = await this.findOne(id);
    await this.citasRepository.remove(cita);
  }
}

