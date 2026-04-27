import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emergencia } from '../entities/emergencia.entity';
import { CreateEmergenciaDto } from '../dto/create-emergencia.dto';
import { UpdateEmergenciaDto } from '../dto/update-emergencia.dto';

@Injectable()
export class EmergenciasService {
  constructor(
    @InjectRepository(Emergencia)
    private emergenciasRepository: Repository<Emergencia>,
  ) {}

  async create(createEmergenciaDto: CreateEmergenciaDto): Promise<Emergencia> {
    const emergencia = this.emergenciasRepository.create(createEmergenciaDto);
    return this.emergenciasRepository.save(emergencia);
  }

  async findAll(): Promise<Emergencia[]> {
    return this.emergenciasRepository.find({ relations: ['mascota', 'usuario', 'veterinaria'] });
  }

  async findByEstado(estado: string): Promise<Emergencia[]> {
    return this.emergenciasRepository.find({
      where: { estado },
      relations: ['mascota', 'usuario', 'veterinaria'],
    });
  }

  async findOne(id: number): Promise<Emergencia> {
    const emergencia = await this.emergenciasRepository.findOne({
      where: { id },
      relations: ['mascota', 'usuario', 'veterinaria'],
    });
    if (!emergencia) {
      throw new NotFoundException(`Emergencia con ID ${id} no encontrada`);
    }
    return emergencia;
  }

  async update(id: number, updateEmergenciaDto: UpdateEmergenciaDto): Promise<Emergencia> {
    const emergencia = await this.findOne(id);
    Object.assign(emergencia, updateEmergenciaDto);
    return this.emergenciasRepository.save(emergencia);
  }

  async remove(id: number): Promise<void> {
    const emergencia = await this.findOne(id);
    await this.emergenciasRepository.remove(emergencia);
  }
}

