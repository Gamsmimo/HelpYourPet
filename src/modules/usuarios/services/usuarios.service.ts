import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
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
      throw new ConflictException('El correo ya estÃ¡ registrado');
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
    const usuario = this.usuariosRepository.create({
      ...createUsuarioDto,
      password: hashedPassword,
      estado: createUsuarioDto.estado ?? true,
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
    const usuario = await this.usuariosRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .where('usuario.id = :id', { id })
      .addSelect('usuario.password')
      .getOne();
    
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

  async updateProfilePicture(id: number, filename: string): Promise<Usuario> {
    const usuario = await this.findOne(id);
    usuario.imagen = `/uploads/profile-pictures/${filename}`;
    return this.usuariosRepository.save(usuario);
  }

  async deleteProfilePicture(id: number): Promise<Usuario> {
    const usuario = await this.findOne(id);
    usuario.imagen = '';
    return this.usuariosRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    usuario.estado = false;
    await this.usuariosRepository.save(usuario);
  }
}

