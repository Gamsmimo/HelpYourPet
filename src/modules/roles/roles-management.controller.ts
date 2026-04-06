import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesManagementService } from './roles-management.service';
import { CreateVeterinarioDto } from './dto/create-veterinario.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('roles-management')
@Controller('roles-management')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RolesManagementController {
  constructor(private readonly rolesManagementService: RolesManagementService) {}

  @Post('create-admin')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Crear un nuevo administrador (solo ADMIN)' })
  @ApiResponse({ status: 201, description: 'Administrador creado exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  async createAdmin(@Body() adminData: any) {
    return this.rolesManagementService.createAdmin(adminData);
  }

  @Post('create-veterinario')
  @Roles('ADMIN', 'VETERINARIO')
  @ApiOperation({ summary: 'Crear un nuevo veterinario (ADMIN o VETERINARIO)' })
  @ApiResponse({ status: 201, description: 'Veterinario creado exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  async createVeterinario(@Body() veterinarioData: CreateVeterinarioDto) {
    return this.rolesManagementService.createVeterinario(veterinarioData);
  }

  @Get('my-view')
  @ApiOperation({ summary: 'Obtener vista según el rol del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Vista según rol' })
  async getMyView(@Request() req) {
    return this.rolesManagementService.getRoleView(req.user);
  }
}
