import { PartialType } from '@nestjs/swagger';
import { CreatePerfilAdminDto } from './create-perfil-admin.dto';

export class UpdatePerfilAdminDto extends PartialType(CreatePerfilAdminDto) {}
