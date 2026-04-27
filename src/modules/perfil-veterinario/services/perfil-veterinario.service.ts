import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfilVeterinario } from '../entities/perfil-veterinario.entity';
import { CreatePerfilVeterinarioDto } from '../dto/create-perfil-veterinario.dto';
import { UpdatePerfilVeterinarioDto } from '../dto/update-perfil-veterinario.dto';

@Injectable()
export class PerfilVeterinarioService {
  constructor(
    @InjectRepository(PerfilVeterinario)
    private perfilVeterinarioRepository: Repository<PerfilVeterinario>,
  ) {}

  async create(createPerfilVeterinarioDto: CreatePerfilVeterinarioDto): Promise<PerfilVeterinario> {
    const perfilVeterinario = this.perfilVeterinarioRepository.create(createPerfilVeterinarioDto);
    return this.perfilVeterinarioRepository.save(perfilVeterinario);
  }

  async findAll(): Promise<PerfilVeterinario[]> {
    return this.perfilVeterinarioRepository.find({ relations: ['usuario'] });
  }

  async findByUsuario(idUsuario: number): Promise<PerfilVeterinario | null> {
    return this.perfilVeterinarioRepository.findOne({
      where: { idUsuario },
      relations: ['usuario'],
    });
  }

  async findOne(id: number): Promise<PerfilVeterinario> {
    const perfilVeterinario = await this.perfilVeterinarioRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!perfilVeterinario) {
      throw new NotFoundException(`PerfilVeterinario con ID ${id} no encontrado`);
    }
    return perfilVeterinario;
  }

  async update(id: number, updatePerfilVeterinarioDto: UpdatePerfilVeterinarioDto): Promise<PerfilVeterinario> {
    const perfilVeterinario = await this.findOne(id);
    Object.assign(perfilVeterinario, updatePerfilVeterinarioDto);
    return this.perfilVeterinarioRepository.save(perfilVeterinario);
  }

  async remove(id: number): Promise<void> {
    const perfilVeterinario = await this.findOne(id);
    await this.perfilVeterinarioRepository.remove(perfilVeterinario);
  }
}

