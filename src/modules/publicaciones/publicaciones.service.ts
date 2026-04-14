import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publicacion } from './entities/publicacion.entity';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectRepository(Publicacion)
    private publicacionesRepository: Repository<Publicacion>,
  ) {}

  async create(idUsuario: number, createPublicacionDto: Omit<CreatePublicacionDto, 'idUsuario'>): Promise<Publicacion> {
    const publicacion = this.publicacionesRepository.create({
      ...createPublicacionDto,
      idUsuario,
    });
    return this.publicacionesRepository.save(publicacion);
  }

  async findAll(): Promise<Publicacion[]> {
    return this.publicacionesRepository.find({
      relations: ['usuario'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUsuario(idUsuario: number): Promise<Publicacion[]> {
    return this.publicacionesRepository.find({
      where: { idUsuario },
      relations: ['usuario'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Publicacion> {
    const publicacion = await this.publicacionesRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!publicacion) {
      throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
    }
    return publicacion;
  }

  async update(id: number, updatePublicacionDto: UpdatePublicacionDto): Promise<Publicacion> {
    const publicacion = await this.findOne(id);
    Object.assign(publicacion, updatePublicacionDto);
    return this.publicacionesRepository.save(publicacion);
  }

  async remove(id: number): Promise<void> {
    const publicacion = await this.findOne(id);
    await this.publicacionesRepository.remove(publicacion);
  }

  async incrementarLikes(id: number): Promise<Publicacion> {
    const publicacion = await this.findOne(id);
    publicacion.likes += 1;
    return this.publicacionesRepository.save(publicacion);
  }

  async incrementarComentarios(id: number): Promise<Publicacion> {
    const publicacion = await this.findOne(id);
    publicacion.comentarios += 1;
    return this.publicacionesRepository.save(publicacion);
  }
}
