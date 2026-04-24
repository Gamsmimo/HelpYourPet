import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { VeterinariasService } from './veterinarias.service';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';
import { Veterinaria } from './entities/veterinaria.entity';

@ApiTags('veterinarias')
@Controller('veterinarias')
export class VeterinariasController {
  constructor(private readonly veterinariasService: VeterinariasService) {}

  @Post('upload-foto')
  @ApiOperation({ summary: 'Subir foto de veterinaria. Devuelve { fotoUrl } con la URL relativa del archivo.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads/veterinarias',
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `vet-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ext = allowed.test(extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  )
  uploadFoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }
    const fotoUrl = `/uploads/veterinarias/${file.filename}`;
    return { fotoUrl };
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva veterinaria' })
  @ApiResponse({ status: 201, description: 'Veterinaria creada', type: Veterinaria })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createVeterinariaDto: CreateVeterinariaDto) {
    return this.veterinariasService.create(createVeterinariaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las veterinarias' })
  @ApiResponse({ status: 200, description: 'Lista de veterinarias', type: [Veterinaria] })
  findAll() {
    return this.veterinariasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener veterinaria por ID' })
  @ApiResponse({ status: 200, description: 'Veterinaria encontrada', type: Veterinaria })
  @ApiResponse({ status: 404, description: 'Veterinaria no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.veterinariasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar veterinaria' })
  @ApiResponse({ status: 200, description: 'Veterinaria actualizada', type: Veterinaria })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVeterinariaDto: UpdateVeterinariaDto) {
    return this.veterinariasService.update(id, updateVeterinariaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar veterinaria' })
  @ApiResponse({ status: 200, description: 'Veterinaria eliminada' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.veterinariasService.remove(id);
  }
}
