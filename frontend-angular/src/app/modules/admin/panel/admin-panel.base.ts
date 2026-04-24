import { PLATFORM_ID, Renderer2, inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

import { AuthService } from '../../../core/services/auth.service';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { VeterinariasApiService } from '../../../core/services/veterinarias-api.service';
import { MascotasApiService } from '../../../core/services/mascotas-api.service';
import { RolesManagementApiService } from '../../../core/services/roles-management-api.service';

/** Acepta array plano o envoltorios tipo { value: [] } / OData. */
function unwrapList(res: unknown): any[] {
  if (Array.isArray(res)) return res;
  if (res && typeof res === 'object') {
    const o = res as Record<string, unknown>;
    const inner = o['value'] ?? o['items'] ?? o['data'];
    if (Array.isArray(inner)) return inner;
  }
  return [];
}

export class AdminPanelBase {
  protected renderer = inject(Renderer2);
  protected router = inject(Router);
  protected platformId = inject(PLATFORM_ID);
  protected cdr = inject(ChangeDetectorRef);
  protected authService = inject(AuthService);
  protected usuariosApi = inject(UsuariosApiService);
  protected veterinariasApi = inject(VeterinariasApiService);
  protected mascotasApi = inject(MascotasApiService);
  protected rolesManagementApi = inject(RolesManagementApiService);

  currentSection = 'dashboard';
  activeTabPets = 'pets-tab';
  activeTabVets = 'clinics-vet-tab';
  activeTabSecurity = 'suspicious-tab';

  mensaje = '';
  error = '';

  public baseUrl = environment.apiUrl;

  isDarkMode = false;

  showProfileModal = false;
  showVetModal = false;
  showClinicModal = false;
  showDetalleUsuario = false;
  showDetalleMascota = false;
  showDetalleVeterinario = false;
  showDetalleVeterinaria = false;
  showDetalleReporte = false;

  fileNameDisplay = '';
  fileSelected = false;
  profileFotoFile: File | null = null;

  // Foto del modal de Registrar Veterinaria
  clinicFotoNombre = '';
  clinicFotoPreview: string | null = null;
  clinicFotoFile: File | null = null;

  adminData = {
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    imagen: 'assets/IMG/humano.jpg',
  };

  stats = {
    totalUsuarios: 0,
    totalMascotas: 0,
    totalVeterinarias: 0,
  };

  usuarios: any[] = [];
  mascotas: any[] = [];
  veterinarias: any[] = [];
  reportes: any[] = [];

  detalleUsuario: any = null;
  detalleMascota: any = null;
  detalleVeterinario: any = null;
  detalleVeterinaria: any = null;
  detalleReporte: any = null;

  // Forms (solo para enviar a API sin tocar el HTML)
  vetFormModel: any = {};
  clinicFormModel: any = {};

  initAdminPanel(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.renderer.addClass(document.body, 'admin-body');
    this.loadTheme();
    this.loadAdminProfile();
    this.refreshAll();
  }

  destroyAdminPanel(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.renderer.removeClass(document.body, 'admin-body');
  }

  setInitialSection(section: string): void {
    this.currentSection = section;
  }

  setSection(section: string, event?: Event): void {
    event?.preventDefault();
    this.currentSection = section;
  }

  setTab(group: string, tabId: string, event?: Event): void {
    event?.preventDefault();
    if (group === 'pets') this.activeTabPets = tabId;
    if (group === 'vets') this.activeTabVets = tabId;
    if (group === 'security') this.activeTabSecurity = tabId;
  }

  loadTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    let saved = localStorage.getItem('clinicpet-theme');
    if (!saved) {
      saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.body.setAttribute('data-theme', saved);
    this.isDarkMode = saved === 'dark';
  }

  toggleTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('clinicpet-theme', theme);
  }

  refreshAll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    forkJoin({
      usuarios: this.usuariosApi.getAll().pipe(catchError(() => of([]))),
      mascotas: this.mascotasApi.getAll().pipe(catchError(() => of([]))),
      veterinarias: this.veterinariasApi.getAll().pipe(catchError(() => of([]))),
    })
      .pipe(
        map(({ usuarios, mascotas, veterinarias }) => {
          const uList = unwrapList(usuarios);
          const mList = unwrapList(mascotas);
          const vList = unwrapList(veterinarias);
          const mappedUsuarios = uList.map((u) => ({
            ...u,
            activo: typeof u.activo === 'boolean' ? u.activo : !!u.estado,
          }));

          const mappedVets = vList.map((v) => ({
            ...v,
            estado: v.estado === true ? 'Activa' : v.estado === false ? 'Inactiva' : v.estado,
          }));

          return {
            usuarios: mappedUsuarios,
            mascotas: mList as any[],
            veterinarias: mappedVets,
          };
        }),
      )
      .subscribe({
        next: ({ usuarios, mascotas, veterinarias }) => {
          this.usuarios = usuarios;
          this.mascotas = mascotas;
          this.veterinarias = veterinarias;
          this.stats = {
            totalUsuarios: usuarios.length,
            totalMascotas: mascotas.length,
            totalVeterinarias: veterinarias.length,
          };
        },
        error: () => {
          this.error = 'No se pudieron cargar los datos del panel.';
        },
      });
  }

  private loadAdminProfile(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const sessionUser = this.authService.getUser();
    if (!sessionUser?.id) {
      return;
    }

    // Cargar datos iniciales desde la sesión (localStorage) para evitar parpadeos
    this.adminData = {
      nombres: sessionUser.nombres || this.adminData.nombres,
      apellidos: sessionUser.apellidos || this.adminData.apellidos,
      correo: sessionUser.correo || this.adminData.correo,
      telefono: sessionUser.telefono || this.adminData.telefono,
      imagen: sessionUser.imagen || this.adminData.imagen,
    };

    // Refrescar desde el servidor para tener lo último en la BD
    this.usuariosApi.getById(sessionUser.id).subscribe({
      next: (u: any) => {
        if (u) {
          this.adminData = {
            nombres: u.nombres || '',
            apellidos: u.apellidos || '',
            correo: u.correo || '',
            telefono: u.telefono || '',
            imagen: u.imagen || 'assets/IMG/humano.jpg',
          };
          // Sincronizar localmente también
          localStorage.setItem('user', JSON.stringify({ ...sessionUser, ...u }));
          this.cdr.detectChanges();
        }
      },
      error: () => {
        // Si falla el API, nos quedamos con lo que había en sesión
      },
    });
  }

  abrirModal(id: string, data?: any): void {
    switch (id) {
      case 'profileModal':
        this.showProfileModal = true;
        break;
      case 'vetModal':
        this.showVetModal = true;
        this.vetFormModel = {};
        // Limpiar campos del formulario de veterinario
        setTimeout(() => {
          const telefonoInput = document.getElementById('vetTelefono') as HTMLInputElement;
          const passwordInput = document.getElementById('vetPassword') as HTMLInputElement;
          if (telefonoInput) telefonoInput.value = '';
          if (passwordInput) passwordInput.value = '';
        }, 0);
        break;
      case 'clinicModal':
        this.showClinicModal = true;
        this.clinicFormModel = {};
        // Reset foto
        this.clinicFotoNombre = '';
        this.clinicFotoPreview = null;
        this.clinicFotoFile = null;
        break;
      case 'detalleUsuarioModal':
        this.detalleUsuario = data;
        this.showDetalleUsuario = true;
        break;
      case 'detalleMascotaModal':
        this.detalleMascota = data;
        this.showDetalleMascota = true;
        break;
      case 'detalleVeterinarioModal':
        this.detalleVeterinario = data;
        this.showDetalleVeterinario = true;
        break;
      case 'detalleVeterinariaModal':
        // Asignamos la data base inmediatamente para que la ventana se abra
        this.detalleVeterinaria = { ...data };
        this.showDetalleVeterinaria = true;
        
        // Consultamos la información completa al backend
        this.veterinariasApi.getById(data.id).subscribe({
          next: (res) => {
            res.estadoTexto = res.estado === true ? 'Activa' : 'Inactiva';
            this.detalleVeterinaria = res;
            this.cdr.detectChanges();
          },
          error: () => this.mostrarMensaje('No se pudo cargar la información expandida de la veterinaria', 'error')
        });
        break;
      case 'detalleReporteModal':
        this.detalleReporte = data;
        this.showDetalleReporte = true;
        break;
      default:
        break;
    }
  }

  cerrarModal(id: string): void {
    switch (id) {
      case 'profileModal':
        this.showProfileModal = false;
        break;
      case 'vetModal':
        this.showVetModal = false;
        break;
      case 'clinicModal':
        this.showClinicModal = false;
        // Reset foto al cerrar
        this.clinicFotoNombre = '';
        this.clinicFotoPreview = null;
        this.clinicFotoFile = null;
        break;
      case 'detalleUsuarioModal':
        this.showDetalleUsuario = false;
        this.detalleUsuario = null;
        break;
      case 'detalleMascotaModal':
        this.showDetalleMascota = false;
        this.detalleMascota = null;
        break;
      case 'detalleVeterinarioModal':
        this.showDetalleVeterinario = false;
        this.detalleVeterinario = null;
        break;
      case 'detalleVeterinariaModal':
        this.showDetalleVeterinaria = false;
        this.detalleVeterinaria = null;
        break;
      case 'detalleReporteModal':
        this.showDetalleReporte = false;
        this.detalleReporte = null;
        break;
      default:
        break;
    }
  }

  onModalBackdropClick(event: MouseEvent, id: string): void {
    const t = event.target as HTMLElement;
    if (t.classList.contains('modal') || t.classList.contains('modale')) {
      this.cerrarModal(id);
    }
  }

  toggleUserStatus(user: any): void {
    const nextEstado = !user.activo;
    this.usuariosApi.update(user.id, { estado: nextEstado }).subscribe({
      next: (updated) => {
        user.activo = typeof updated?.activo === 'boolean' ? updated.activo : !!updated?.estado;
        this.mostrarMensaje(`Usuario ${user.activo ? 'activado' : 'desactivado'} correctamente`, 'success');
      },
      error: () => this.mostrarMensaje('No se pudo actualizar el estado del usuario', 'error'),
    });
  }

  toggleClinicStatus(clinic: any): void {
    const current = clinic.estado === 'Activa';
    const nextEstadoBool = !current;
    this.veterinariasApi.update(clinic.id, { estado: nextEstadoBool }).subscribe({
      next: (updated) => {
        const boolEstado = typeof updated?.estado === 'boolean' ? updated.estado : nextEstadoBool;
        clinic.estado = boolEstado ? 'Activa' : 'Inactiva';
        this.mostrarMensaje(`Veterinaria ${boolEstado ? 'activada' : 'desactivada'} correctamente`, 'success');
      },
      error: () => this.mostrarMensaje('No se pudo actualizar el estado de la veterinaria', 'error'),
    });
  }

  asignarAutoridad(_reporte: any, autoridad: string): void {
    if (!autoridad) {
      this.mostrarMensaje('Por favor selecciona una autoridad', 'warning');
      return;
    }
    this.mostrarMensaje('Asignación de autoridad no configurada en API (pendiente)', 'info');
  }

  marcarCompletado(_reporte: any): void {
    this.mostrarMensaje('Cambio de estado de reporte no configurado en API (pendiente)', 'info');
  }

  cerrarSesion(event?: Event): void {
    event?.preventDefault();
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar la sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result: { isConfirmed: boolean }) => {
      if (result.isConfirmed) {
        this.authService.logout();
      }
    });
  }

  mostrarMensaje(mensaje: string, tipo: any = 'info'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    Swal.fire({
      text: mensaje,
      icon: tipo,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }

  onClinicFotoChange(event: Event): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.clinicFotoFile = file;
      this.clinicFotoNombre = file.name;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.clinicFotoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.clinicFotoFile = null;
      this.clinicFotoNombre = '';
      this.clinicFotoPreview = null;
    }
  }

  onFileInputChange(event: Event): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.profileFotoFile = file;
      this.fileNameDisplay = file.name;
      this.fileSelected = true;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const r = e.target?.result as string;
        if (r) this.adminData.imagen = r;
      };
      reader.readAsDataURL(file);
    } else {
      this.profileFotoFile = null;
      this.fileNameDisplay = '';
      this.fileSelected = false;
    }
  }

  onImageUploadSubmit(event?: Event): void {
    if (event) event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.fileSelected || !this.profileFotoFile) return;

    const sessionUser = this.authService.getUser();
    if (!sessionUser?.id) return;

    this.mostrarMensaje('Subiendo imagen de perfil...', 'info');

    this.usuariosApi.uploadFoto(this.profileFotoFile).subscribe({
      next: (res) => {
        const payload = { imagen: res.fotoUrl };
        // Actualizar UI inmediatamente
        this.adminData.imagen = res.fotoUrl;

        this.usuariosApi.update(sessionUser.id, payload).subscribe({
          next: () => {
             this.mostrarMensaje('Foto de perfil actualizada correctamente', 'success');
             const updatedUser = { ...sessionUser, ...payload };
             localStorage.setItem('user', JSON.stringify(updatedUser));
             
             this.profileFotoFile = null;
             this.fileSelected = false;
             this.fileNameDisplay = '';
             this.cdr.detectChanges();
          },
          error: () => this.mostrarMensaje('Error al enlazar la foto con tu perfil', 'error')
        });
      },
      error: () => this.mostrarMensaje('No se pudo subir la foto físicamente al servidor', 'error'),
    });
  }

  onProfileFormSubmit(event: Event): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const sessionUser = this.authService.getUser();
    console.log('Enviando actualización de perfil para:', sessionUser?.id);
    if (!sessionUser?.id) {
      this.cerrarModal('profileModal');
      this.mostrarMensaje('Actualizando perfil...', 'info');
      return;
    }

    const doUpdate = (fotoUrl?: string) => {
      const payload: any = {
        nombres: this.adminData.nombres,
        apellidos: this.adminData.apellidos,
        telefono: this.adminData.telefono,
      };
      if (fotoUrl) {
        payload.imagen = fotoUrl;
        this.adminData.imagen = fotoUrl;
      }
      console.log('Enviando Patch a Usuarios con payload:', payload);
      this.usuariosApi.update(sessionUser.id, payload).subscribe({
        next: (res) => {
          this.cerrarModal('profileModal');
          this.mostrarMensaje('Perfil actualizado', 'success');
          
          // Actualizar sesión local
          const updatedUser = { ...sessionUser, ...payload };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Refrescar desde el servidor para confirmar persistencia y actualizar navbar
          this.loadAdminProfile();
        },
        error: () => {
          this.mostrarMensaje('No se pudo actualizar el perfil', 'error');
        },
      });
    };

    if (this.profileFotoFile) {
      this.usuariosApi.uploadFoto(this.profileFotoFile).subscribe({
        next: (res) => {
          doUpdate(res.fotoUrl);
          this.profileFotoFile = null; // reset
        },
        error: () => {
          this.mostrarMensaje('No se pudo subir la foto, se guardará sin ella', 'warning');
          doUpdate();
        },
      });
    } else {
      doUpdate();
    }
  }

  onVetFormSubmit(event: Event): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const veterinariaId = (document.getElementById('vetClinic') as HTMLSelectElement | null)?.value;

    const payload = {
      nombres: (document.getElementById('vetNombres') as HTMLInputElement | null)?.value || '',
      apellidos: (document.getElementById('vetApellidos') as HTMLInputElement | null)?.value || '',
      correo: (document.getElementById('vetCorreo') as HTMLInputElement | null)?.value || '',
      contrasena: (document.getElementById('vetPassword') as HTMLInputElement | null)?.value || '',
      num_documento: (document.getElementById('vetNumDocumento') as HTMLInputElement | null)?.value || '',
      telefono: (document.getElementById('vetTelefono') as HTMLInputElement | null)?.value || '',
      direccion: (document.getElementById('vetDireccion') as HTMLInputElement | null)?.value || '',
      tipo_documento: (document.getElementById('vetTipoDocumento') as HTMLSelectElement | null)?.value || 'CC',
      edad: parseInt((document.getElementById('vetEdad') as HTMLInputElement | null)?.value || '18'),
      especialidad: (document.getElementById('vetEspecialidad') as HTMLInputElement | null)?.value || '',
      tarjetaProfesional: (document.getElementById('vetTarjetaProfesional') as HTMLInputElement | null)?.value || '',
      experiencia: parseInt((document.getElementById('vetExperiencia') as HTMLInputElement | null)?.value || '0'),
      idVeterinaria: veterinariaId ? parseInt(veterinariaId) : undefined,
      estado: true,
    };

    if (!payload.correo || !payload.contrasena) {
      this.mostrarMensaje('Por favor completa correo y contraseña', 'warning');
      return;
    }

    this.rolesManagementApi.createVeterinario(payload).subscribe({
      next: () => {
        this.cerrarModal('vetModal');
        this.mostrarMensaje('Veterinario registrado correctamente', 'success');
        this.refreshAll();
      },
      error: (e) => this.mostrarMensaje(e?.error?.message || 'No se pudo registrar el veterinario', 'error'),
    });
  }

  onClinicFormSubmit(event: Event): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const estadoStr = (document.getElementById('clinicEstado') as HTMLSelectElement | null)?.value || 'Activa';

    const payload: any = {
      nombre: (document.getElementById('clinicNombre') as HTMLInputElement | null)?.value || '',
      correo: (document.getElementById('clinicCorreo') as HTMLInputElement | null)?.value || '',
      direccion: (document.getElementById('clinicDireccion') as HTMLInputElement | null)?.value || '',
      telefono: (document.getElementById('clinicTelefono') as HTMLInputElement | null)?.value || '',
      horarioAtencion: (document.getElementById('clinicHorario') as HTMLInputElement | null)?.value || '',
      descripcion: (document.getElementById('clinicDescripcion') as HTMLTextAreaElement | null)?.value || '',
      serviciosOfrecidos: (document.getElementById('clinicServices') as HTMLTextAreaElement | null)?.value || '',
      estado: estadoStr === 'Activa',
    };

    const doCreate = (fotoUrl?: string) => {
      if (fotoUrl) payload.foto = fotoUrl;
      this.veterinariasApi.create(payload).subscribe({
        next: () => {
          this.cerrarModal('clinicModal');
          this.mostrarMensaje('Veterinaria registrada correctamente', 'success');
          this.refreshAll();
        },
        error: (e) => this.mostrarMensaje(e?.error?.message || 'No se pudo registrar la veterinaria', 'error'),
      });
    };

    if (this.clinicFotoFile) {
      this.veterinariasApi.uploadFoto(this.clinicFotoFile).subscribe({
        next: (res) => doCreate(res.fotoUrl),
        error: () => {
          this.mostrarMensaje('No se pudo subir la foto, se registrará sin imagen', 'warning');
          doCreate();
        },
      });
    } else {
      doCreate();
    }
  }
}

