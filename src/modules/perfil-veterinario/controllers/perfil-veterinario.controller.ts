import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PerfilVeterinarioService } from '../services/perfil-veterinario.service';
import { CreatePerfilVeterinarioDto } from '../dto/create-perfil-veterinario.dto';
import { UpdatePerfilVeterinarioDto } from '../dto/update-perfil-veterinario.dto';
import { PerfilVeterinario } from '../entities/perfil-veterinario.entity';

@ApiTags('perfil-veterinario')
@Controller('perfil-veterinario')
export class PerfilVeterinarioController {
  constructor(private readonly perfilVeterinarioService: PerfilVeterinarioService) {}

  @Post()
  @ApiOperation({ summary: 'Crear perfil de veterinario' })
  @ApiResponse({ status: 201, description: 'Perfil creado', type: PerfilVeterinario })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createPerfilVeterinarioDto: CreatePerfilVeterinarioDto) {
    return this.perfilVeterinarioService.create(createPerfilVeterinarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los perfiles' })
  @ApiResponse({ status: 200, description: 'Lista de perfiles', type: [PerfilVeterinario] })
  findAll() {
    return this.perfilVeterinarioService.findAll();
  }

  @Get('usuario/:idUsuario')
  @ApiOperation({ summary: 'Obtener perfil por usuario' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado', type: PerfilVeterinario })
  findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.perfilVeterinarioService.findByUsuario(idUsuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener perfil por ID' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado', type: PerfilVeterinario })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.perfilVeterinarioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar perfil' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado', type: PerfilVeterinario })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePerfilVeterinarioDto: UpdatePerfilVeterinarioDto) {
    return this.perfilVeterinarioService.update(id, updatePerfilVeterinarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar perfil' })
  @ApiResponse({ status: 200, description: 'Perfil eliminado' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.perfilVeterinarioService.remove(id);
  }
}



