import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { UpdateHistoriaClinicaDto } from './dto/update-historia-clinica.dto';

@Injectable()
export class HistoriasClinicasService {
  constructor(
    @InjectRepository(HistoriaClinica)
    private historiasRepository: Repository<HistoriaClinica>,
  ) {}

  async create(createHistoriaClinicaDto: CreateHistoriaClinicaDto): Promise<HistoriaClinica> {
    const historia = this.historiasRepository.create(createHistoriaClinicaDto);
    return this.historiasRepository.save(historia);
  }

  async findAll(): Promise<HistoriaClinica[]> {
    return this.historiasRepository.find({ relations: ['mascota', 'veterinario'] });
  }

  async findByMascota(idMascota: number): Promise<HistoriaClinica[]> {
    return this.historiasRepository.find({
      where: { idMascota },
      relations: ['mascota', 'veterinario'],
    });
  }

  async findOne(id: number): Promise<HistoriaClinica> {
    const historia = await this.historiasRepository.findOne({
      where: { id },
      relations: ['mascota', 'veterinario'],
    });
    if (!historia) {
      throw new NotFoundException(`Historia clínica con ID ${id} no encontrada`);
    }
    return historia;
  }

  async update(id: number, updateHistoriaClinicaDto: UpdateHistoriaClinicaDto): Promise<HistoriaClinica> {
    const historia = await this.findOne(id);
    Object.assign(historia, updateHistoriaClinicaDto);
    return this.historiasRepository.save(historia);
  }

  async remove(id: number): Promise<void> {
    const historia = await this.findOne(id);
    await this.historiasRepository.remove(historia);
  }
}
