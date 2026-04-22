import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MascotasService } from './mascotas.service';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { Mascota } from './entities/mascota.entity';

@ApiTags('mascotas')
@Controller('mascotas')
export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva mascota' })
  @ApiResponse({ status: 201, description: 'Mascota creada exitosamente', type: Mascota })
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('foto', {
    storage: diskStorage({
      destination: './uploads/mascotas',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Solo se permiten imágenes'), false);
      }
      cb(null, true);
    }
  }))
  create(
    @Body() createMascotaDto: CreateMascotaDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    if (file) {
      createMascotaDto.foto = `/uploads/mascotas/${file.filename}`;
    }
    // Parsear datos numéricos si vienen de FormData (como strings)
    if (createMascotaDto.idUsuario) {
      createMascotaDto.idUsuario = parseInt(createMascotaDto.idUsuario.toString(), 10);
    }
    if (createMascotaDto.edad) {
      createMascotaDto.edad = parseInt(createMascotaDto.edad.toString(), 10);
    }
    return this.mascotasService.create(createMascotaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las mascotas' })
  @ApiResponse({ status: 200, description: 'Lista de mascotas', type: [Mascota] })
  findAll() {
    return this.mascotasService.findAll();
  }

  @Get('usuario/:idUsuario')
  @ApiOperation({ summary: 'Listar mascotas de un usuario' })
  @ApiResponse({ status: 200, description: 'Lista de mascotas del usuario', type: [Mascota] })
  findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.mascotasService.findByUsuario(idUsuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener mascota por ID' })
  @ApiResponse({ status: 200, description: 'Mascota encontrada', type: Mascota })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mascotasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar mascota' })
  @ApiResponse({ status: 200, description: 'Mascota actualizada', type: Mascota })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMascotaDto: UpdateMascotaDto) {
    return this.mascotasService.update(id, updateMascotaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar mascota' })
  @ApiResponse({ status: 200, description: 'Mascota eliminada' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mascotasService.remove(id);
  }
}
