import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { CreateReaccionDto } from './dto/create-reaccion.dto';
import { Publicacion } from './entities/publicacion.entity';
import { Comentario } from './entities/comentario.entity';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('publicaciones')
@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  // ==================== COMENTARIOS (rutas estáticas primero) ====================

  @Post('comentarios')
  @ApiOperation({ summary: 'Crear un comentario en una publicación' })
  @ApiResponse({ status: 201, description: 'Comentario creado', type: Comentario })
  createComentario(@Body() createComentarioDto: CreateComentarioDto) {
    return this.publicacionesService.createComentario(createComentarioDto);
  }

  @Delete('comentarios/:id')
  @ApiOperation({ summary: 'Eliminar un comentario' })
  @ApiResponse({ status: 200, description: 'Comentario eliminado' })
  deleteComentario(@Param('id', ParseIntPipe) id: number) {
    return this.publicacionesService.deleteComentario(id);
  }

  // ==================== REACCIONES (rutas estáticas primero) ====================

  @Post('reacciones')
  @ApiOperation({ summary: 'Dar o quitar like a una publicación' })
  @ApiResponse({ status: 200, description: 'Reacción actualizada' })
  toggleReaccion(@Body() createReaccionDto: CreateReaccionDto) {
    return this.publicacionesService.toggleReaccion(createReaccionDto);
  }

  // ==================== PUBLICACIONES ====================

  @Post()
  @ApiOperation({ summary: 'Crear nueva publicación' })
  @ApiResponse({ status: 201, description: 'Publicación creada', type: Publicacion })
  @UseGuards(RolesGuard)
  @Roles('USUARIO', 'VETERINARIO')
  @ApiBearerAuth('JWT-auth')
  create(
    @GetUser('id') authUserId: number,
    @Body() createPublicacionDto: CreatePublicacionDto,
  ) {
    const resto = { ...createPublicacionDto };
    delete resto.idUsuario;
    return this.publicacionesService.create(authUserId, resto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener todas las publicaciones' })
  @ApiResponse({ status: 200, description: 'Lista de publicaciones', type: [Publicacion] })
  findAll() {
    return this.publicacionesService.findAll();
  }

  @Public()
  @Get('usuario/:idUsuario')
  @ApiOperation({ summary: 'Obtener publicaciones de un usuario' })
  @ApiResponse({ status: 200, description: 'Publicaciones del usuario', type: [Publicacion] })
  findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.publicacionesService.findByUsuario(idUsuario);
  }

  @Public()
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
  @UseGuards(RolesGuard)
  @Roles('USUARIO', 'VETERINARIO')
  @ApiBearerAuth('JWT-auth')
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') authUserId: number,
    @Body() updatePublicacionDto: UpdatePublicacionDto,
  ) {
    return this.publicacionesService.update(id, updatePublicacionDto, authUserId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar publicación' })
  @ApiResponse({ status: 200, description: 'Publicación eliminada' })
  @UseGuards(RolesGuard)
  @Roles('USUARIO', 'VETERINARIO')
  @ApiBearerAuth('JWT-auth')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') authUserId: number,
  ) {
    return this.publicacionesService.remove(id, authUserId);
  }

  @Post(':id/likes')
  @ApiOperation({ summary: 'Incrementar likes de una publicación' })
  @ApiResponse({ status: 200, description: 'Likes incrementados', type: Publicacion })
  @ApiBearerAuth('JWT-auth')
  incrementarLikes(@Param('id', ParseIntPipe) id: number) {
    return this.publicacionesService.incrementarLikes(id);
  }

  @Public()
  @Get(':id/comentarios/list')
  @ApiOperation({ summary: 'Obtener comentarios de una publicación' })
  @ApiResponse({ status: 200, description: 'Lista de comentarios', type: [Comentario] })
  getComentarios(@Param('id', ParseIntPipe) id: number) {
    return this.publicacionesService.getComentariosByPublicacion(id);
  }

  @Public()
  @Get(':id/reacciones')
  @ApiOperation({ summary: 'Obtener reacciones de una publicación' })
  @ApiResponse({ status: 200, description: 'Lista de reacciones' })
  getReacciones(@Param('id', ParseIntPipe) id: number) {
    return this.publicacionesService.getReaccionesByPublicacion(id);
  }

  @Public()
  @Get(':id/reacciones/check/:idUsuario')
  @ApiOperation({ summary: 'Verificar si un usuario ya reaccionó a una publicación' })
  @ApiResponse({ status: 200, description: 'Estado de la reacción' })
  checkUserReaction(
    @Param('id', ParseIntPipe) id: number,
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
  ) {
    return this.publicacionesService.checkUserReaction(id, idUsuario);
  }
}
