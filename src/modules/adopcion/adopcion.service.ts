import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adopcion } from './entities/adopcion.entity';
import { CreateAdopcionDto } from './dto/create-adopcion.dto';
import { UpdateAdopcionDto } from './dto/update-adopcion.dto';

@Injectable()
export class AdopcionService {
  constructor(
    @InjectRepository(Adopcion)
    private adopcionRepository: Repository<Adopcion>,
  ) {}

  async create(createAdopcionDto: CreateAdopcionDto): Promise<Adopcion> {
    const adopcion = this.adopcionRepository.create(createAdopcionDto);
    return this.adopcionRepository.save(adopcion);
  }

  async findAll(): Promise<Adopcion[]> {
    return this.adopcionRepository.find({ relations: ['mascota', 'usuario'] });
  }

  async findOne(id: number): Promise<Adopcion> {
    const adopcion = await this.adopcionRepository.findOne({
      where: { id },
      relations: ['mascota', 'usuario'],
    });
    if (!adopcion) {
      throw new NotFoundException(`Adopción con ID ${id} no encontrada`);
    }
    return adopcion;
  }

  async findByEstado(estado: string): Promise<Adopcion[]> {
    return this.adopcionRepository.find({
      where: { estado },
      relations: ['mascota', 'usuario'],
    });
  }

  async findByUsuario(idUsuario: number): Promise<Adopcion[]> {
    return this.adopcionRepository.find({
      where: { idUsuario },
      relations: ['mascota', 'usuario'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateAdopcionDto: UpdateAdopcionDto): Promise<Adopcion> {
    const adopcion = await this.findOne(id);
    Object.assign(adopcion, updateAdopcionDto);
    return this.adopcionRepository.save(adopcion);
  }

  async remove(id: number): Promise<void> {
    const adopcion = await this.findOne(id);
    await this.adopcionRepository.remove(adopcion);
  }
}
