import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PerfilAdminService } from '../services/perfil-admin.service';
import { CreatePerfilAdminDto } from '../dto/create-perfil-admin.dto';
import { UpdatePerfilAdminDto } from '../dto/update-perfil-admin.dto';
import { PerfilAdmin } from '../entities/perfil-admin.entity';

@ApiTags('perfil-admin')
@Controller('perfil-admin')
export class PerfilAdminController {
  constructor(private readonly perfilAdminService: PerfilAdminService) {}

  @Post()
  @ApiOperation({ summary: 'Crear perfil de administrador' })
  @ApiResponse({ status: 201, description: 'Perfil creado', type: PerfilAdmin })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createPerfilAdminDto: CreatePerfilAdminDto) {
    return this.perfilAdminService.create(createPerfilAdminDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los perfiles' })
  @ApiResponse({ status: 200, description: 'Lista de perfiles', type: [PerfilAdmin] })
  findAll() {
    return this.perfilAdminService.findAll();
  }

  @Get('usuario/:idUsuario')
  @ApiOperation({ summary: 'Obtener perfil por usuario' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado', type: PerfilAdmin })
  findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.perfilAdminService.findByUsuario(idUsuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener perfil por ID' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado', type: PerfilAdmin })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.perfilAdminService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar perfil' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado', type: PerfilAdmin })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePerfilAdminDto: UpdatePerfilAdminDto) {
    return this.perfilAdminService.update(id, updatePerfilAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar perfil' })
  @ApiResponse({ status: 200, description: 'Perfil eliminado' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.perfilAdminService.remove(id);
  }
}



