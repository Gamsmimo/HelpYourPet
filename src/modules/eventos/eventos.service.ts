import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from './entities/evento.entity';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private eventosRepository: Repository<Evento>,
  ) {}

  async create(createEventoDto: CreateEventoDto): Promise<Evento> {
    const evento = this.eventosRepository.create(createEventoDto);
    return this.eventosRepository.save(evento);
  }

  async findAll(): Promise<Evento[]> {
    return this.eventosRepository.find({ relations: ['veterinaria'] });
  }

  async findByVeterinaria(idVeterinaria: number): Promise<Evento[]> {
    return this.eventosRepository.find({
      where: { idVeterinaria },
      relations: ['veterinaria'],
    });
  }

  async findOne(id: number): Promise<Evento> {
    const evento = await this.eventosRepository.findOne({
      where: { id },
      relations: ['veterinaria'],
    });
    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }
    return evento;
  }

  async update(id: number, updateEventoDto: UpdateEventoDto): Promise<Evento> {
    const evento = await this.findOne(id);
    Object.assign(evento, updateEventoDto);
    return this.eventosRepository.save(evento);
  }

  async remove(id: number): Promise<void> {
    const evento = await this.findOne(id);
    await this.eventosRepository.remove(evento);
  }
}
