import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from '../entities/carrito.entity';
import { CreateCarritoDto } from '../dto/create-carrito.dto';
import { UpdateCarritoDto } from '../dto/update-carrito.dto';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,
  ) {}

  async create(createCarritoDto: CreateCarritoDto): Promise<Carrito> {
    const carrito = this.carritoRepository.create(createCarritoDto);
    return this.carritoRepository.save(carrito);
  }

  async findAll(): Promise<Carrito[]> {
    return this.carritoRepository.find({ relations: ['usuario'] });
  }

  async findByUsuario(idUsuario: number): Promise<Carrito[]> {
    return this.carritoRepository.find({
      where: { idUsuario },
      relations: ['usuario'],
    });
  }

  async findOne(id: number): Promise<Carrito> {
    const carrito = await this.carritoRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!carrito) {
      throw new NotFoundException(`Carrito con ID ${id} no encontrado`);
    }
    return carrito;
  }

  async update(id: number, updateCarritoDto: UpdateCarritoDto): Promise<Carrito> {
    const carrito = await this.findOne(id);
    Object.assign(carrito, updateCarritoDto);
    return this.carritoRepository.save(carrito);
  }

  async remove(id: number): Promise<void> {
    const carrito = await this.findOne(id);
    await this.carritoRepository.remove(carrito);
  }
}

