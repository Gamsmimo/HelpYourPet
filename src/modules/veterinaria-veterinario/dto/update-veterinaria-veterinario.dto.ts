import { PartialType } from '@nestjs/swagger';
import { CreateVeterinariaVeterinarioDto } from './create-veterinaria-veterinario.dto';

export class UpdateVeterinariaVeterinarioDto extends PartialType(CreateVeterinariaVeterinarioDto) {}
