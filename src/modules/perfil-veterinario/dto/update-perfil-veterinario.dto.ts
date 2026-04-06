import { PartialType } from '@nestjs/swagger';
import { CreatePerfilVeterinarioDto } from './create-perfil-veterinario.dto';

export class UpdatePerfilVeterinarioDto extends PartialType(CreatePerfilVeterinarioDto) {}
