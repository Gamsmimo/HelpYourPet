import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateVeterinarioDto } from './dto/create-veterinario.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { PerfilVeterinario } from '../perfil-veterinario/entities/perfil-veterinario.entity';

@Injectable()
export class RolesManagementService {
  constructor(
    private usuariosService: UsuariosService,
    @InjectRepository(PerfilVeterinario)
    private perfilVeterinarioRepository: Repository<PerfilVeterinario>,
  ) {}

  /**
   * Crear un administrador (solo otro admin puede hacerlo)
   */
  async createAdmin(adminData: any) {
    // Buscar rol de administrador
    const rolAdmin = await this.usuariosService.findRoleByName('ADMIN');
    if (!rolAdmin) {
      throw new NotFoundException('Rol de administrador no encontrado');
    }

    // Crear usuario con rol de admin
    const usuario = await this.usuariosService.create({
      ...adminData,
      rol_id: rolAdmin.id,
    });

    return {
      message: 'Administrador creado exitosamente',
      user: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: 'ADMIN',
      },
    };
  }

  /**
   * Crear un veterinario (solo admin de veterinaria o admin del sistema)
   */
  async createVeterinario(veterinarioData: CreateVeterinarioDto) {
    // Buscar rol de veterinario
    const rolVeterinario = await this.usuariosService.findRoleByName('VETERINARIO');
    if (!rolVeterinario) {
      throw new NotFoundException('Rol de veterinario no encontrado');
    }

    // Verificar si el correo ya existe
    const existingUser = await this.usuariosService.findByCorreo(veterinarioData.correo);
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Crear usuario con rol de veterinario
    // Texto plano: UsuariosService.create() ya aplica bcrypt una vez (no doble-hash).
    const usuario = await this.usuariosService.create({
      nombres: veterinarioData.nombres,
      apellidos: veterinarioData.apellidos,
      correo: veterinarioData.correo,
      password: veterinarioData.contrasena,
      num_documento: veterinarioData.num_documento,
      telefono: veterinarioData.telefono,
      direccion: veterinarioData.direccion || '',
      tipo_documento: (veterinarioData.tipo_documento || 'CC') as any,
      edad: veterinarioData.edad || 18,
      rol_id: rolVeterinario.id,
      activo: true,
    });

    // Crear perfil de veterinario
    const perfilVeterinario = this.perfilVeterinarioRepository.create({
      idUsuario: usuario.id,
      especialidad: veterinarioData.especialidad || '',
      tarjetaProfesional: veterinarioData.tarjetaProfesional || '',
      experiencia: veterinarioData.experiencia || 0,
      estado: veterinarioData.estado ?? true,
      idVeterinaria: veterinarioData.idVeterinaria || null,
    });

    await this.perfilVeterinarioRepository.save(perfilVeterinario);

    return {
      message: 'Veterinario creado exitosamente',
      user: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: 'VETERINARIO',
        idVeterinaria: veterinarioData.idVeterinaria,
      },
    };
  }

  /**
   * Crear relación veterinaria-veterinario
   */
  private async createVeterinariaVeterinario(idVeterinario: number, idVeterinaria: number) {
    // Aquí deberías inyectar el servicio de veterinaria-veterinario
    // Por ahora, lo dejamos preparado
    console.log(`Creando relación: veterinario ${idVeterinario} - veterinaria ${idVeterinaria}`);
  }

  /**
   * Obtener vista según el rol del usuario
   */
  async getRoleView(user: any) {
    // Si user tiene rol directamente, usarlo, si no buscar en BD
    const rol = user.rol?.nombre || user.nombreRol;
    
    switch (rol) {
      case 'ADMIN':
        return this.getAdminView(user);
      
      case 'VETERINARIO':
        return this.getVeterinarioView(user);
      
      case 'USUARIO':
        return this.getUsuarioView(user);
      
      default:
        throw new NotFoundException('Rol no reconocido');
    }
  }

  /**
   * Vista de Administrador
   */
  private getAdminView(usuario: any) {
    return {
      rol: 'ADMIN',
      vista: 'admin-dashboard',
      permisos: [
        'usuarios:crud',
        'veterinarias:crud',
        'veterinarios:create',
        'servicios:crud',
        'productos:crud',
        'reportes:view',
        'configuracion:manage',
      ],
      menu: [
        {
          title: 'Dashboard',
          icon: 'dashboard',
          route: '/admin/dashboard',
        },
        {
          title: 'Gestión de Usuarios',
          icon: 'people',
          route: '/admin/usuarios',
        },
        {
          title: 'Veterinarias',
          icon: 'business',
          route: '/admin/veterinarias',
        },
        {
          title: 'Crear Veterinario',
          icon: 'person_add',
          route: '/admin/veterinarios/create',
        },
        {
          title: 'Servicios',
          icon: 'medical_services',
          route: '/admin/servicios',
        },
        {
          title: 'Productos',
          icon: 'inventory',
          route: '/admin/productos',
        },
        {
          title: 'Reportes',
          icon: 'assessment',
          route: '/admin/reportes',
        },
        {
          title: 'Configuración',
          icon: 'settings',
          route: '/admin/configuracion',
        },
      ],
      user: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: usuario.rol.nombre,
      },
    };
  }

  /**
   * Vista de Veterinario
   */
  private getVeterinarioView(usuario: any) {
    return {
      rol: 'VETERINARIO',
      vista: 'veterinario-dashboard',
      permisos: [
        'citas:crud',
        'historias-clinicas:crud',
        'servicios:view',
        'mascotas:view',
        'emergencias:crud',
      ],
      menu: [
        {
          title: 'Dashboard',
          icon: 'dashboard',
          route: '/veterinario/dashboard',
        },
        {
          title: 'Mis Citas',
          icon: 'calendar_today',
          route: '/veterinario/citas',
        },
        {
          title: 'Historias Clínicas',
          icon: 'medical_information',
          route: '/veterinario/historias-clinicas',
        },
        {
          title: 'Mascotas',
          icon: 'pets',
          route: '/veterinario/mascotas',
        },
        {
          title: 'Emergencias',
          icon: 'emergency',
          route: '/veterinario/emergencias',
        },
        {
          title: 'Servicios',
          icon: 'medical_services',
          route: '/veterinario/servicios',
        },
        {
          title: 'Mi Perfil',
          icon: 'person',
          route: '/veterinario/perfil',
        },
      ],
      user: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: usuario.rol.nombre,
      },
    };
  }

  /**
   * Vista de Usuario
   */
  private getUsuarioView(usuario: any) {
    return {
      rol: 'USUARIO',
      vista: 'usuario-dashboard',
      permisos: [
        'mascotas:crud',
        'citas:create',
        'citas:view_own',
        'productos:view',
        'carrito:crud',
        'adopcion:view',
      ],
      menu: [
        {
          title: 'Dashboard',
          icon: 'dashboard',
          route: '/usuario/dashboard',
        },
        {
          title: 'Mis Mascotas',
          icon: 'pets',
          route: '/usuario/mascotas',
        },
        {
          title: 'Agendar Cita',
          icon: 'calendar_add',
          route: '/usuario/citas/create',
        },
        {
          title: 'Mis Citas',
          icon: 'calendar_today',
          route: '/usuario/citas',
        },
        {
          title: 'Adopción',
          icon: 'favorite',
          route: '/usuario/adopcion',
        },
        {
          title: 'Tienda',
          icon: 'shopping_cart',
          route: '/usuario/productos',
        },
        {
          title: 'Mi Carrito',
          icon: 'shopping_bag',
          route: '/usuario/carrito',
        },
        {
          title: 'Mi Perfil',
          icon: 'person',
          route: '/usuario/perfil',
        },
      ],
      user: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: usuario.rol.nombre,
      },
    };
  }
}
