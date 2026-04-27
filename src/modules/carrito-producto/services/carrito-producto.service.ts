import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarritoProducto } from '../entities/carrito-producto.entity';
import { CreateCarritoProductoDto } from '../dto/create-carrito-producto.dto';
import { UpdateCarritoProductoDto } from '../dto/update-carrito-producto.dto';

@Injectable()
export class CarritoProductoService {
  constructor(
    @InjectRepository(CarritoProducto)
    private carritoProductoRepository: Repository<CarritoProducto>,
  ) {}

  async create(createCarritoProductoDto: CreateCarritoProductoDto): Promise<CarritoProducto> {
    const carritoProducto = this.carritoProductoRepository.create(createCarritoProductoDto);
    return this.carritoProductoRepository.save(carritoProducto);
  }

  async findAll(): Promise<CarritoProducto[]> {
    return this.carritoProductoRepository.find({ relations: ['carrito', 'producto'] });
  }

  async findByCarrito(idCarrito: number): Promise<CarritoProducto[]> {
    return this.carritoProductoRepository.find({
      where: { idCarrito },
      relations: ['carrito', 'producto'],
    });
  }

  async findOne(id: number): Promise<CarritoProducto> {
    const carritoProducto = await this.carritoProductoRepository.findOne({
      where: { id },
      relations: ['carrito', 'producto'],
    });
    if (!carritoProducto) {
      throw new NotFoundException(`CarritoProducto con ID ${id} no encontrado`);
    }
    return carritoProducto;
  }

  async update(id: number, updateCarritoProductoDto: UpdateCarritoProductoDto): Promise<CarritoProducto> {
    const carritoProducto = await this.findOne(id);
    Object.assign(carritoProducto, updateCarritoProductoDto);
    return this.carritoProductoRepository.save(carritoProducto);
  }

  async remove(id: number): Promise<void> {
    const carritoProducto = await this.findOne(id);
    await this.carritoProductoRepository.remove(carritoProducto);
  }
}

