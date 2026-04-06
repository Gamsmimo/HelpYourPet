import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const existingEmail = await this.usuariosRepository.findOne({
      where: { correo: createUsuarioDto.correo },
    });
    if (existingEmail) {
      throw new ConflictException('El correo ya está registrado');
    }

    const existingDoc = await this.usuariosRepository.findOne({
      where: { num_documento: createUsuarioDto.num_documento },
    });
    if (existingDoc) {
      throw new ConflictException('El número de documento ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
    const usuario = this.usuariosRepository.create({
      ...createUsuarioDto,
      password: hashedPassword,
    });

    return this.usuariosRepository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find({ relations: ['rol'] });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: ['rol'],
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async findOneWithPassword(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: ['rol'],
      select: ['id', 'nombres', 'apellidos', 'correo', 'password', 'activo', 'rol_id'],
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async findByCorreo(correo: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({
      where: { correo },
      relations: ['rol'],
    });
  }

  async findRoleByName(nombre: string) {
    const rolRepository = this.usuariosRepository.manager.getRepository('Rol');
    return rolRepository.findOne({ where: { nombre } });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }

    Object.assign(usuario, updateUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    usuario.activo = false;
    await this.usuariosRepository.save(usuario);
  }
}
