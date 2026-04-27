import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleVenta } from '../entities/detalle-venta.entity';
import { CreateDetalleVentaDto } from '../dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from '../dto/update-detalle-venta.dto';

@Injectable()
export class DetalleVentaService {
  constructor(
    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,
  ) {}

  async create(createDetalleVentaDto: CreateDetalleVentaDto): Promise<DetalleVenta> {
    const detalleVenta = this.detalleVentaRepository.create(createDetalleVentaDto);
    return this.detalleVentaRepository.save(detalleVenta);
  }

  async findAll(): Promise<DetalleVenta[]> {
    return this.detalleVentaRepository.find({ relations: ['producto', 'venta'] });
  }

  async findByVenta(idVenta: number): Promise<DetalleVenta[]> {
    return this.detalleVentaRepository.find({
      where: { idVenta },
      relations: ['producto', 'venta'],
    });
  }

  async findOne(id: number): Promise<DetalleVenta> {
    const detalleVenta = await this.detalleVentaRepository.findOne({
      where: { id },
      relations: ['producto', 'venta'],
    });
    if (!detalleVenta) {
      throw new NotFoundException(`DetalleVenta con ID ${id} no encontrado`);
    }
    return detalleVenta;
  }

  async update(id: number, updateDetalleVentaDto: UpdateDetalleVentaDto): Promise<DetalleVenta> {
    const detalleVenta = await this.findOne(id);
    Object.assign(detalleVenta, updateDetalleVentaDto);
    return this.detalleVentaRepository.save(detalleVenta);
  }

  async remove(id: number): Promise<void> {
    const detalleVenta = await this.findOne(id);
    await this.detalleVentaRepository.remove(detalleVenta);
  }
}

