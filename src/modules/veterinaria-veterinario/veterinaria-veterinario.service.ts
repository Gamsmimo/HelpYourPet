import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VeterinariaVeterinario } from './entities/veterinaria-veterinario.entity';
import { CreateVeterinariaVeterinarioDto } from './dto/create-veterinaria-veterinario.dto';
import { UpdateVeterinariaVeterinarioDto } from './dto/update-veterinaria-veterinario.dto';

@Injectable()
export class VeterinariaVeterinarioService {
  constructor(
    @InjectRepository(VeterinariaVeterinario)
    private veterinariaVeterinarioRepository: Repository<VeterinariaVeterinario>,
  ) {}

  async create(createVeterinariaVeterinarioDto: CreateVeterinariaVeterinarioDto): Promise<VeterinariaVeterinario> {
    const veterinariaVeterinario = this.veterinariaVeterinarioRepository.create(createVeterinariaVeterinarioDto);
    return this.veterinariaVeterinarioRepository.save(veterinariaVeterinario);
  }

  async findAll(): Promise<VeterinariaVeterinario[]> {
    return this.veterinariaVeterinarioRepository.find({ relations: ['veterinaria', 'veterinario'] });
  }

  async findByVeterinaria(idVeterinaria: number): Promise<VeterinariaVeterinario[]> {
    return this.veterinariaVeterinarioRepository.find({
      where: { idVeterinaria },
      relations: ['veterinaria', 'veterinario'],
    });
  }

  async findOne(id: number): Promise<VeterinariaVeterinario> {
    const veterinariaVeterinario = await this.veterinariaVeterinarioRepository.findOne({
      where: { id },
      relations: ['veterinaria', 'veterinario'],
    });
    if (!veterinariaVeterinario) {
      throw new NotFoundException(`VeterinariaVeterinario con ID ${id} no encontrado`);
    }
    return veterinariaVeterinario;
  }

  async update(id: number, updateVeterinariaVeterinarioDto: UpdateVeterinariaVeterinarioDto): Promise<VeterinariaVeterinario> {
    const veterinariaVeterinario = await this.findOne(id);
    Object.assign(veterinariaVeterinario, updateVeterinariaVeterinarioDto);
    return this.veterinariaVeterinarioRepository.save(veterinariaVeterinario);
  }

  async remove(id: number): Promise<void> {
    const veterinariaVeterinario = await this.findOne(id);
    await this.veterinariaVeterinarioRepository.remove(veterinariaVeterinario);
  }
}
