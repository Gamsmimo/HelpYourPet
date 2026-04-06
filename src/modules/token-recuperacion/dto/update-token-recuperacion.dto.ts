import { PartialType } from '@nestjs/swagger';
import { CreateTokenRecuperacionDto } from './create-token-recuperacion.dto';

export class UpdateTokenRecuperacionDto extends PartialType(CreateTokenRecuperacionDto) {}
