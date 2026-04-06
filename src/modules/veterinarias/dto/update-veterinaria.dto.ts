import { PartialType } from '@nestjs/swagger';
import { CreateVeterinariaDto } from './create-veterinaria.dto';

export class UpdateVeterinariaDto extends PartialType(CreateVeterinariaDto) {}
