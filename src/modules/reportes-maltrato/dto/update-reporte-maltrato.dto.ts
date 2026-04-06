import { PartialType } from '@nestjs/swagger';
import { CreateReporteMaltratoDto } from './create-reporte-maltrato.dto';

export class UpdateReporteMaltratoDto extends PartialType(CreateReporteMaltratoDto) {}
