import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfilAdmin } from '../entities/perfil-admin.entity';
import { CreatePerfilAdminDto } from '../dto/create-perfil-admin.dto';
import { UpdatePerfilAdminDto } from '../dto/update-perfil-admin.dto';

@Injectable()
export class PerfilAdminService {
  constructor(
    @InjectRepository(PerfilAdmin)
    private perfilAdminRepository: Repository<PerfilAdmin>,
  ) {}

  async create(createPerfilAdminDto: CreatePerfilAdminDto): Promise<PerfilAdmin> {
    const perfilAdmin = this.perfilAdminRepository.create(createPerfilAdminDto);
    return this.perfilAdminRepository.save(perfilAdmin);
  }

  async findAll(): Promise<PerfilAdmin[]> {
    return this.perfilAdminRepository.find({ relations: ['usuario'] });
  }

  async findByUsuario(idUsuario: number): Promise<PerfilAdmin | null> {
    return this.perfilAdminRepository.findOne({
      where: { idUsuario },
      relations: ['usuario'],
    });
  }

  async findOne(id: number): Promise<PerfilAdmin> {
    const perfilAdmin = await this.perfilAdminRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!perfilAdmin) {
      throw new NotFoundException(`PerfilAdmin con ID ${id} no encontrado`);
    }
    return perfilAdmin;
  }

  async update(id: number, updatePerfilAdminDto: UpdatePerfilAdminDto): Promise<PerfilAdmin> {
    const perfilAdmin = await this.findOne(id);
    Object.assign(perfilAdmin, updatePerfilAdminDto);
    return this.perfilAdminRepository.save(perfilAdmin);
  }

  async remove(id: number): Promise<void> {
    const perfilAdmin = await this.findOne(id);
    await this.perfilAdminRepository.remove(perfilAdmin);
  }
}

