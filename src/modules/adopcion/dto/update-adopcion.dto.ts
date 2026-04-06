import { PartialType } from '@nestjs/swagger';
import { CreateAdopcionDto } from './create-adopcion.dto';

export class UpdateAdopcionDto extends PartialType(CreateAdopcionDto) {}
