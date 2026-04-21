import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publicacion } from './entities/publicacion.entity';
import { Comentario } from './entities/comentario.entity';
import { Reaccion } from './entities/reaccion.entity';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { CreateReaccionDto } from './dto/create-reaccion.dto';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectRepository(Publicacion)
    private publicacionesRepository: Repository<Publicacion>,
    @InjectRepository(Comentario)
    private comentariosRepository: Repository<Comentario>,
    @InjectRepository(Reaccion)
    private reaccionesRepository: Repository<Reaccion>,
  ) {}

  async create(idUsuario: number, createPublicacionDto: Omit<CreatePublicacionDto, 'idUsuario'>): Promise<Publicacion> {
    const publicacion = this.publicacionesRepository.create({
      ...createPublicacionDto,
      idUsuario,
    });
    return this.publicacionesRepository.save(publicacion);
  }

  async findAll(): Promise<any[]> {
    const publicaciones = await this.publicacionesRepository.find({
      relations: ['usuario'],
      order: { createdAt: 'DESC' },
    });

    // Agregar comentarios y reacciones a cada publicación
    const result = await Promise.all(
      publicaciones.map(async (pub) => {
        const comentarios = await this.getComentariosByPublicacion(pub.id);
        const reacciones = await this.getReaccionesByPublicacion(pub.id);
        return {
          ...pub,
          comentariosData: comentarios,
          reaccionesData: reacciones,
          likes: reacciones.length,
        };
      }),
    );

    return result;
  }

  async findByUsuario(idUsuario: number): Promise<any[]> {
    const publicaciones = await this.publicacionesRepository.find({
      where: { usuario: { id: idUsuario } },
      relations: ['usuario'],
      order: { createdAt: 'DESC' },
    });

    // Agregar comentarios y reacciones a cada publicación
    const result = await Promise.all(
      publicaciones.map(async (pub) => {
        const comentarios = await this.getComentariosByPublicacion(pub.id);
        const reacciones = await this.getReaccionesByPublicacion(pub.id);
        return {
          ...pub,
          comentariosData: comentarios,
          reaccionesData: reacciones,
          comentariosCount: comentarios.length,
          likesCount: reacciones.length,
        };
      }),
    );

    return result;
  }

  async findOne(id: number): Promise<Publicacion> {
    const publicacion = await this.publicacionesRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!publicacion) {
      throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
    }
    return publicacion;
  }

  async update(id: number, updatePublicacionDto: UpdatePublicacionDto): Promise<Publicacion> {
    const publicacion = await this.findOne(id);
    Object.assign(publicacion, updatePublicacionDto);
    return this.publicacionesRepository.save(publicacion);
  }

  async remove(id: number): Promise<void> {
    const publicacion = await this.findOne(id);
    await this.publicacionesRepository.remove(publicacion);
  }

  async incrementarLikes(id: number): Promise<Publicacion> {
    const publicacion = await this.findOne(id);
    publicacion.likes += 1;
    return this.publicacionesRepository.save(publicacion);
  }

  async incrementarComentarios(id: number): Promise<Publicacion> {
    const publicacion = await this.findOne(id);
    publicacion.comentarios += 1;
    return this.publicacionesRepository.save(publicacion);
  }

  // ==================== COMENTARIOS ====================

  async createComentario(createComentarioDto: CreateComentarioDto): Promise<Comentario> {
    // Verificar que la publicación existe
    await this.findOne(createComentarioDto.idPublicacion);
    
    const comentario = this.comentariosRepository.create(createComentarioDto);
    const saved = await this.comentariosRepository.save(comentario);
    
    // Incrementar contador de comentarios en la publicación
    await this.incrementarComentarios(createComentarioDto.idPublicacion);
    
    return this.comentariosRepository.findOne({
      where: { id: saved.id },
      relations: ['usuario'],
    }) as Promise<Comentario>;
  }

  async getComentariosByPublicacion(idPublicacion: number): Promise<Comentario[]> {
    return this.comentariosRepository.find({
      where: { idPublicacion },
      relations: ['usuario'],
      order: { createdAt: 'ASC' },
    });
  }

  async deleteComentario(id: number): Promise<void> {
    const comentario = await this.comentariosRepository.findOne({ where: { id } });
    if (!comentario) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }
    await this.comentariosRepository.remove(comentario);
  }

  // ==================== REACCIONES (LIKES) ====================

  async toggleReaccion(createReaccionDto: CreateReaccionDto): Promise<{ liked: boolean; totalLikes: number }> {
    // Verificar que la publicación existe
    await this.findOne(createReaccionDto.idPublicacion);
    
    // Buscar si ya existe una reacción del usuario
    const existingReaccion = await this.reaccionesRepository.findOne({
      where: {
        idPublicacion: createReaccionDto.idPublicacion,
        idUsuario: createReaccionDto.idUsuario,
      },
    });

    if (existingReaccion) {
      // Si existe, eliminarla (quitar like)
      await this.reaccionesRepository.remove(existingReaccion);
      const totalLikes = await this.reaccionesRepository.count({
        where: { idPublicacion: createReaccionDto.idPublicacion },
      });
      return { liked: false, totalLikes };
    } else {
      // Si no existe, crearla (dar like)
      const reaccion = this.reaccionesRepository.create({
        ...createReaccionDto,
        tipo: createReaccionDto.tipo || 'like',
      });
      await this.reaccionesRepository.save(reaccion);
      const totalLikes = await this.reaccionesRepository.count({
        where: { idPublicacion: createReaccionDto.idPublicacion },
      });
      return { liked: true, totalLikes };
    }
  }

  async getReaccionesByPublicacion(idPublicacion: number): Promise<Reaccion[]> {
    return this.reaccionesRepository.find({
      where: { idPublicacion },
      relations: ['usuario'],
    });
  }

  async checkUserReaction(idPublicacion: number, idUsuario: number): Promise<boolean> {
    const reaccion = await this.reaccionesRepository.findOne({
      where: { idPublicacion, idUsuario },
    });
    return !!reaccion;
  }
}
