import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReporteMaltrato } from './entities/reporte-maltrato.entity';
import { CreateReporteMaltratoDto } from './dto/create-reporte-maltrato.dto';
import { UpdateReporteMaltratoDto } from './dto/update-reporte-maltrato.dto';

@Injectable()
export class ReportesMaltratoService {
  constructor(
    @InjectRepository(ReporteMaltrato)
    private reportesMaltratoRepository: Repository<ReporteMaltrato>,
  ) {}

  async create(createReporteMaltratoDto: CreateReporteMaltratoDto): Promise<ReporteMaltrato> {
    const reporteMaltrato = this.reportesMaltratoRepository.create(createReporteMaltratoDto);
    return this.reportesMaltratoRepository.save(reporteMaltrato);
  }

  async findAll(): Promise<ReporteMaltrato[]> {
    return this.reportesMaltratoRepository.find({ relations: ['usuario'] });
  }

  async findByEstado(estado: string): Promise<ReporteMaltrato[]> {
    return this.reportesMaltratoRepository.find({
      where: { estado },
      relations: ['usuario'],
    });
  }

  async findOne(id: number): Promise<ReporteMaltrato> {
    const reporteMaltrato = await this.reportesMaltratoRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!reporteMaltrato) {
      throw new NotFoundException(`ReporteMaltrato con ID ${id} no encontrado`);
    }
    return reporteMaltrato;
  }

  async update(id: number, updateReporteMaltratoDto: UpdateReporteMaltratoDto): Promise<ReporteMaltrato> {
    const reporteMaltrato = await this.findOne(id);
    Object.assign(reporteMaltrato, updateReporteMaltratoDto);
    return this.reportesMaltratoRepository.save(reporteMaltrato);
  }

  async remove(id: number): Promise<void> {
    const reporteMaltrato = await this.findOne(id);
    await this.reportesMaltratoRepository.remove(reporteMaltrato);
  }
}
