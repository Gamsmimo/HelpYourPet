import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascota } from './entities/mascota.entity';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';

@Injectable()
export class MascotasService {
  constructor(
    @InjectRepository(Mascota)
    private mascotasRepository: Repository<Mascota>,
  ) {}

  async create(createMascotaDto: CreateMascotaDto): Promise<Mascota> {
    const mascota = this.mascotasRepository.create(createMascotaDto);
    return this.mascotasRepository.save(mascota);
  }

  async findAll(): Promise<Mascota[]> {
    return this.mascotasRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number): Promise<Mascota> {
    const mascota = await this.mascotasRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!mascota) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }
    return mascota;
  }

  async findByUsuario(idUsuario: number): Promise<Mascota[]> {
    return this.mascotasRepository.find({
      where: { idUsuario },
      relations: ['usuario'],
    });
  }

  async update(id: number, updateMascotaDto: UpdateMascotaDto): Promise<Mascota> {
    const mascota = await this.findOne(id);
    Object.assign(mascota, updateMascotaDto);
    return this.mascotasRepository.save(mascota);
  }

  async remove(id: number): Promise<void> {
    const mascota = await this.findOne(id);
    await this.mascotasRepository.remove(mascota);
  }
}
