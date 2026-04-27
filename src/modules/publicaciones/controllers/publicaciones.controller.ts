import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PublicacionesService } from '../services/publicaciones.service';
import { CreatePublicacionDto } from '../dto/create-publicacion.dto';
import { UpdatePublicacionDto } from '../dto/update-publicacion.dto';
import { CreateComentarioDto } from '../dto/create-comentario.dto';
import { CreateReaccionDto } from '../dto/create-reaccion.dto';
import { Publicacion } from '../entities/publicacion.entity';
import { Comentario } from '../entities/comentario.entity';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('publicaciones')
@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}
  

  // ==================== COMENTARIOS (rutas estÃ¡ticas primero) ====================

  @Post('comentarios')
  @ApiOperation({ summary: 'Crear un comentario en una publicaciÃ³n' })
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

  // ==================== REACCIONES (rutas estÃ¡ticas primero) ====================

  @Post('reacciones')
  @ApiOperation({ summary: 'Dar o quitar like a una publicaciÃ³n' })
  @ApiResponse({ status: 200, description: 'ReacciÃ³n actualizada' })
  toggleReaccion(@Body() createReaccionDto: CreateReaccionDto) {
    return this.publicacionesService.toggleReaccion(createReaccionDto);
  }

  // ==================== PUBLICACIONES ====================

  @Post()
  @ApiOperation({ summary: 'Crear nueva publicaciÃ³n' })
  @ApiResponse({ status: 201, description: 'PublicaciÃ³n creada', type: Publicacion })
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

  @Get()
  @ApiOperation({ summary: 'Obtener todas las publicaciones' })
  @ApiResponse({ status: 200, description: 'Lista de publicaciones', type: [Publicacion] })
  @UseGuards(RolesGuard)
  @Roles('USUARIO', 'VETERINARIO')
  @ApiBearerAuth('JWT-auth')
  findAll() {
    return this.publicacionesService.findAll();
  }

  @Get('usuario/:idUsuario')
  @ApiOperation({ summary: 'Obtener publicaciones de un usuario' })
  @ApiResponse({ status: 200, description: 'Publicaciones del usuario', type: [Publicacion] })
  @UseGuards(RolesGuard)
  @Roles('USUARIO', 'VETERINARIO')
  @ApiBearerAuth('JWT-auth')
  findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.publicacionesService.findByUsuario(idUsuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener publicaciÃ³n por ID' })
  @ApiResponse({ status: 200, description: 'PublicaciÃ³n encontrada', type: Publicacion })
  @ApiResponse({ status: 404, description: 'PublicaciÃ³n no encontrada' })
  @UseGuards(RolesGuard)
  @Roles('USUARIO', 'VETERINARIO')
  @ApiBearerAuth('JWT-auth')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.publicacionesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar publicaciÃ³n' })
  @ApiResponse({ status: 200, description: 'PublicaciÃ³n actualizada', type: Publicacion })
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
  @ApiOperation({ summary: 'Eliminar publicaciÃ³n' })
  @ApiResponse({ status: 200, description: 'PublicaciÃ³n eliminada' })
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
  @ApiOperation({ summary: 'Incrementar likes de una publicaciÃ³n' })
  @ApiResponse({ status: 200, description: 'Likes incrementados', type: Publicacion })
  @ApiBearerAuth('JWT-auth')
  incrementarLikes(@Param('id', ParseIntPipe) id: number) {
    return this.publicacionesService.incrementarLikes(id);
  }

  @Get(':id/comentarios/list')
  @ApiOperation({ summary: 'Obtener comentarios de una publicaciÃ³n' })
  @ApiResponse({ status: 200, description: 'Lista de comentarios', type: [Comentario] })
  @UseGuards(RolesGuard)
  @Roles('USUARIO', 'VETERINARIO')
  @ApiBearerAuth('JWT-auth')
  getComentarios(@Param('id', ParseIntPipe) id: number) {
    return this.publicacionesService.getComentariosByPublicacion(id);
  }

  @Get(':id/reacciones')
  @ApiOperation({ summary: 'Obtener reacciones de una publicaciÃ³n' })
  @ApiResponse({ status: 200, description: 'Lista de reacciones' })
  @UseGuards(RolesGuard)
  @Roles('USUARIO', 'VETERINARIO')
  @ApiBearerAuth('JWT-auth')
  getReacciones(@Param('id', ParseIntPipe) id: number) {
    return this.publicacionesService.getReaccionesByPublicacion(id);
  }

  @Get(':id/reacciones/check/:idUsuario')
  @ApiOperation({ summary: 'Verificar si un usuario ya reaccionÃ³ a una publicaciÃ³n' })
  @ApiResponse({ status: 200, description: 'Estado de la reacciÃ³n' })
  @UseGuards(RolesGuard)
  @Roles('USUARIO', 'VETERINARIO')
  @ApiBearerAuth('JWT-auth')
  checkUserReaction(
    @Param('id', ParseIntPipe) id: number,
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
  ) {
    return this.publicacionesService.checkUserReaction(id, idUsuario);
  }
}


