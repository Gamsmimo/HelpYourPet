import { PartialType } from '@nestjs/swagger';
import { CreateEmergenciaDto } from './create-emergencia.dto';

export class UpdateEmergenciaDto extends PartialType(CreateEmergenciaDto) {}
