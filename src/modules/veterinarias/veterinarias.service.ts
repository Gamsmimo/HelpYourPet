import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veterinaria } from './entities/veterinaria.entity';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';

@Injectable()
export class VeterinariasService {
  constructor(
    @InjectRepository(Veterinaria)
    private veterinariasRepository: Repository<Veterinaria>,
  ) {}

  async create(createVeterinariaDto: CreateVeterinariaDto): Promise<Veterinaria> {
    const veterinaria = this.veterinariasRepository.create(createVeterinariaDto);
    return this.veterinariasRepository.save(veterinaria);
  }

  async findAll(): Promise<Veterinaria[]> {
    return this.veterinariasRepository.find();
  }

  async findOne(id: number): Promise<Veterinaria> {
    const veterinaria = await this.veterinariasRepository.findOne({ where: { id } });
    if (!veterinaria) {
      throw new NotFoundException(`Veterinaria con ID ${id} no encontrada`);
    }
    return veterinaria;
  }

  async update(id: number, updateVeterinariaDto: UpdateVeterinariaDto): Promise<Veterinaria> {
    const veterinaria = await this.findOne(id);
    Object.assign(veterinaria, updateVeterinariaDto);
    return this.veterinariasRepository.save(veterinaria);
  }

  async remove(id: number): Promise<void> {
    const veterinaria = await this.findOne(id);
    await this.veterinariasRepository.remove(veterinaria);
  }
}
