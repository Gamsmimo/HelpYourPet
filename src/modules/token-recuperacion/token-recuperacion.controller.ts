import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TokenRecuperacionService } from './token-recuperacion.service';
import { CreateTokenRecuperacionDto } from './dto/create-token-recuperacion.dto';
import { UpdateTokenRecuperacionDto } from './dto/update-token-recuperacion.dto';
import { TokenRecuperacion } from './entities/token-recuperacion.entity';

@ApiTags('token-recuperacion')
@Controller('token-recuperacion')
export class TokenRecuperacionController {
  constructor(private readonly tokenRecuperacionService: TokenRecuperacionService) {}

  @Post()
  @ApiOperation({ summary: 'Crear token de recuperación' })
  @ApiResponse({ status: 201, description: 'Token creado', type: TokenRecuperacion })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createTokenRecuperacionDto: CreateTokenRecuperacionDto) {
    return this.tokenRecuperacionService.create(createTokenRecuperacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los tokens' })
  @ApiResponse({ status: 200, description: 'Lista de tokens', type: [TokenRecuperacion] })
  findAll() {
    return this.tokenRecuperacionService.findAll();
  }

  @Get('token/:token')
  @ApiOperation({ summary: 'Buscar por token' })
  @ApiResponse({ status: 200, description: 'Token encontrado', type: TokenRecuperacion })
  findByToken(@Param('token') token: string) {
    return this.tokenRecuperacionService.findByToken(token);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener token por ID' })
  @ApiResponse({ status: 200, description: 'Token encontrado', type: TokenRecuperacion })
  @ApiResponse({ status: 404, description: 'Token no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tokenRecuperacionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar token' })
  @ApiResponse({ status: 200, description: 'Token actualizado', type: TokenRecuperacion })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTokenRecuperacionDto: UpdateTokenRecuperacionDto) {
    return this.tokenRecuperacionService.update(id, updateTokenRecuperacionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar token' })
  @ApiResponse({ status: 200, description: 'Token eliminado' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tokenRecuperacionService.remove(id);
  }
}
