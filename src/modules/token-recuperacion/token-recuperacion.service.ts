import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenRecuperacion } from './entities/token-recuperacion.entity';
import { CreateTokenRecuperacionDto } from './dto/create-token-recuperacion.dto';
import { UpdateTokenRecuperacionDto } from './dto/update-token-recuperacion.dto';

@Injectable()
export class TokenRecuperacionService {
  constructor(
    @InjectRepository(TokenRecuperacion)
    private tokenRecuperacionRepository: Repository<TokenRecuperacion>,
  ) {}

  async create(createTokenRecuperacionDto: CreateTokenRecuperacionDto): Promise<TokenRecuperacion> {
    const tokenRecuperacion = this.tokenRecuperacionRepository.create(createTokenRecuperacionDto);
    return this.tokenRecuperacionRepository.save(tokenRecuperacion);
  }

  async findAll(): Promise<TokenRecuperacion[]> {
    return this.tokenRecuperacionRepository.find({ relations: ['usuario'] });
  }

  async findByToken(token: string): Promise<TokenRecuperacion | null> {
    return this.tokenRecuperacionRepository.findOne({
      where: { token },
      relations: ['usuario'],
    });
  }

  async findOne(id: number): Promise<TokenRecuperacion> {
    const tokenRecuperacion = await this.tokenRecuperacionRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!tokenRecuperacion) {
      throw new NotFoundException(`TokenRecuperacion con ID ${id} no encontrado`);
    }
    return tokenRecuperacion;
  }

  async update(id: number, updateTokenRecuperacionDto: UpdateTokenRecuperacionDto): Promise<TokenRecuperacion> {
    const tokenRecuperacion = await this.findOne(id);
    Object.assign(tokenRecuperacion, updateTokenRecuperacionDto);
    return this.tokenRecuperacionRepository.save(tokenRecuperacion);
  }

  async remove(id: number): Promise<void> {
    const tokenRecuperacion = await this.findOne(id);
    await this.tokenRecuperacionRepository.remove(tokenRecuperacion);
  }
}
