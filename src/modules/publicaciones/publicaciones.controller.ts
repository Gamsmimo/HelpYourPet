import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { Publicacion } from './entities/publicacion.entity';

@ApiTags('publicaciones')
@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva publicación' })
  @ApiResponse({ status: 201, description: 'Publicación creada', type: Publicacion })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createPublicacionDto: CreatePublicacionDto, @Param('idUsuario', ParseIntPipe) idUsuario?: number) {
    // El idUsuario debería venir del JWT en un caso real
    const userId = idUsuario || 1;
    return this.publicacionesService.create(userId, createPublicacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las publicaciones' })
  @ApiResponse({ status: 200, description: 'Lista de publicaciones', type: [Publicacion] })
  findAll() {
    return this.publicacionesService.findAll();
  }

  @Get('usuario/:idUsuario')
  @ApiOperation({ summary: 'Obtener publicaciones de un usuario' })
  @ApiResponse({ status: 200, description: 'Publicaciones del usuario', type: [Publicacion] })
  findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.publicacionesService.findByUsuario(idUsuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener publicación por ID' })
  @ApiResponse({ status: 200, description: 'Publicación encontrada', type: Publicacion })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.publicacionesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar publicación' })
  @ApiResponse({ status: 200, description: 'Publicación actualizada', type: Publicacion })
  @ApiBearerAuth('JWT-auth')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePublicacionDto: UpdatePublicacionDto,
  ) {
    return this.publicacionesService.update(id, updatePublicacionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar publicación' })
  @ApiResponse({ status: 200, description: 'Publicación eliminada' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.publicacionesService.remove(id);
  }

  @Post(':id/likes')
  @ApiOperation({ summary: 'Incrementar likes de una publicación' })
  @ApiResponse({ status: 200, description: 'Likes incrementados', type: Publicacion })
  @ApiBearerAuth('JWT-auth')
  incrementarLikes(@Param('id', ParseIntPipe) id: number) {
    return this.publicacionesService.incrementarLikes(id);
  }

  @Post(':id/comentarios')
  @ApiOperation({ summary: 'Incrementar comentarios de una publicación' })
  @ApiResponse({ status: 200, description: 'Comentarios incrementados', type: Publicacion })
  @ApiBearerAuth('JWT-auth')
  incrementarComentarios(@Param('id', ParseIntPipe) id: number) {
    return this.publicacionesService.incrementarComentarios(id);
  }
}
