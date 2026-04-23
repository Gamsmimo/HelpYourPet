import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MascotasService } from '../../../core/services/mascotas.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { AdopcionService } from '../../../core/services/adopcion.service';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit, OnDestroy {
  usuarioLogueado: any = {};
  usuarioEdit: any = {};
  usuarioOriginal: any = {};
  mascotas: any[] = [];
  activeSection = 'mascotas';
  sidebarOpen = false;
  compras: any[] = [];
  citas: any[] = [];
  adopciones: any[] = [];
  publicaciones: any[] = [];

  // Modales
  showAddPetModal = false;
  showEditPetModal = false;

  // Mascota nueva
  nuevaMascota: any = {
    nombre: '',
    especie: '',
    raza: '',
    edad: null,
    unidadEdad: 'Años',
    genero: '',
    tamano: '',
    descripcion: ''
  };
  nuevaMascotaFoto: File | null = null;

  // Mascota en edición
  mascotaEdit: any = {};

  // Foto de perfil
  profilePicturePreview: string | null = null;
  profilePictureFile: File | null = null;

  // Tema
  darkMode = false;

  // Estado de carga
  isLoadingUser = true;
  isLoadingPublicaciones = false; // CORRECCIÓN: Inicializar en false, solo se activa al pedir la sección
  userImageLoaded = false;
  dataInitialized = false;

  // CORRECCIÓN: Estados de error explícitos
  errorCargaUsuario = false;
  errorCargaPublicaciones = false;
  errorMensajeUsuario = '';
  errorMensajePublicaciones = '';

  // Control para evitar llamadas duplicadas
  private publicacionesCargadas = false;
  private publicacionesSubscription?: Subscription;
  private publicacionesTimeoutId: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private mascotasService: MascotasService,
    private usuariosService: UsuariosService,
    private adopcionService: AdopcionService,
    private publicacionesService: PublicacionesService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.inicializarDatos();
    }
  }

  ngOnDestroy(): void {
    if (this.publicacionesSubscription) {
      this.publicacionesSubscription.unsubscribe();
    }
    if (this.publicacionesTimeoutId) {
      clearTimeout(this.publicacionesTimeoutId);
      this.publicacionesTimeoutId = null;
    }
  }

  inicializarDatos(): void {
    console.log('[PERFIL] inicializarDatos llamado');
    this.errorCargaUsuario = false;
    this.errorMensajeUsuario = '';
    this.dataInitialized = false;

    const userData = this.authService.getUser();
    const userId = userData?.id || userData?.id_usuario;

    if (!userId) {
      console.error('No se encontró ID de usuario. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }

    // CORRECCIÓN OPTIMISTA: Mostrar inmediatamente los datos del localStorage sin spinner
    this.usuarioLogueado = { ...userData, id: userId };
    this.usuarioEdit = { ...userData, id: userId };
    this.usuarioOriginal = { ...userData, id: userId };
    
    // No bloqueamos la UI con spinner al navegar entre rutas; mostramos datos en cuanto lleguen.
    this.isLoadingUser = false;
    this.userImageLoaded = !!userData?.imagen;
    this.dataInitialized = true;

    // Disparar las llamadas HTTP necesarias
    this.cargarDatosCompletosUsuario(userId);
    this.cargarMascotas();
    this.cargarPublicaciones();
    this.loadTheme();
  }

  // CORRECCIÓN: Método unificado de carga, sin doble llamada HTTP
  private cargarDatosCompletosUsuario(userId: number): void {
    console.log('[PERFIL] Iniciando HTTP GET para usuario:', userId);
    this.usuariosService.getUsuario(userId).subscribe({
      next: (data) => {
        console.log('[PERFIL] HTTP GET EXITOSO:', data.nombres);
        this.usuarioLogueado = { ...data, id: userId };
        this.usuarioEdit = { ...data, id: userId };
        this.usuarioOriginal = { ...data, id: userId };
        this.isLoadingUser = false;
        this.userImageLoaded = true;
        this.dataInitialized = true;
        this.errorCargaUsuario = false;

        // Sincronizar en localStorage para toda la app
        this.authService.updateUserData(data);

        // Forzar detección de cambios para reflejar los nuevos datos del usuario
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('[PERFIL] HTTP GET ERROR:', error);
        this.isLoadingUser = false;
        this.dataInitialized = true;
        this.errorCargaUsuario = true;

        // Mensaje amigable según el tipo de error
        if (error.status === 401) {
          this.errorMensajeUsuario = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
          setTimeout(() => {
            this.authService.logout();
          }, 2000);
        } else if (error.status === 0) {
          this.errorMensajeUsuario = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else {
          this.errorMensajeUsuario = 'No se pudieron cargar los datos de tu perfil. Intenta recargar la página.';
        }

        // Forzar detección de cambios para mostrar el error
        this.cdr.detectChanges();
      }
    });
  }

  showSection(sectionId: string): void {
    this.activeSection = sectionId;
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.sidebarOpen = false;
    }
    switch (sectionId) {
      case 'mascotas':
        this.cargarMascotas();
        break;
      case 'compras':
        this.cargarCompras();
        break;
      case 'adopciones-usuario':
        // CORRECCIÓN: Siempre cargar publicaciones al entrar a la sección
        this.cargarPublicaciones();
        break;
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  cargarMascotas(): void {
    console.log('[PERFIL] cargarMascotas llamado. ID de usuario:', this.usuarioLogueado?.id);
    if (this.usuarioLogueado?.id) {
      this.mascotasService.getMascotasByUsuario(this.usuarioLogueado.id).subscribe({
        next: (data) => { 
          console.log('[PERFIL] Mascotas recibidas:', data);
          this.mascotas = (data || []).map((mascota: any) => ({
            ...mascota,
            genero: mascota.genero || mascota.sexo || '',
            unidadEdad: mascota.unidadEdad || mascota.unidad_edad || 'Años',
            foto: this.getMascotaImageUrl(mascota.foto)
          }));
          
          // En Angular moderno, delegamos a setTimeout para forzar 
          // el ciclo de ChangeDetection luego de que los datos asíncronos llegan.
          // Evitamos usar NgZone.run directamente porque en configuraciones Zoneless falla.
          setTimeout(() => {
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          }, 0);
        },
        error: (err) => { 
          console.error('[PERFIL] Error al cargar mascotas:', err);
          this.mascotas = []; 
          
          setTimeout(() => {
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          }, 0);
        }
      });
    } else {
      console.warn('[PERFIL] No hay ID de usuario para cargar mascotas');
    }
  }

  cargarCompras(): void { this.compras = []; }

  agregarMascota(): void {
    console.log('Agregar mascota');
  }

  verMascota(id: number): void {
    console.log('Ver mascota:', id);
  }

  editarMascota(id: number): void {
    console.log('Editar mascota:', id);
  }

  eliminarMascota(id: number): void {
    Swal.fire({
      title: '¿Eliminar mascota?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mascotasService.deleteMascota(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminada!', 'La mascota ha sido eliminada.', 'success');
            this.cargarMascotas();
          },
          error: () => { Swal.fire('Error', 'No se pudo eliminar la mascota', 'error'); }
        });
      }
    });
  }

  // CORRECCIÓN: Método público limpio que siempre carga desde el backend
  cargarPublicaciones(): void {
    console.log('[PERFIL] cargarPublicaciones llamado');
    const userId = Number(this.usuarioLogueado?.id || this.usuarioLogueado?.id_usuario);
    if (!userId) {
      this.isLoadingPublicaciones = false;
      this.publicaciones = [];
      return;
    }

    this.isLoadingPublicaciones = true;
    this.errorCargaPublicaciones = false;
    this.errorMensajePublicaciones = '';

    // Cancela llamadas previas para evitar estados de carga colgados
    if (this.publicacionesSubscription) {
      this.publicacionesSubscription.unsubscribe();
    }
    if (this.publicacionesTimeoutId) {
      clearTimeout(this.publicacionesTimeoutId);
      this.publicacionesTimeoutId = null;
    }

    // Red de seguridad: si la petición queda pendiente demasiado tiempo, cerramos carga y mostramos error
    this.publicacionesTimeoutId = setTimeout(() => {
      if (this.isLoadingPublicaciones) {
        if (this.publicacionesSubscription) {
          this.publicacionesSubscription.unsubscribe();
        }
        this.isLoadingPublicaciones = false;
        this.errorCargaPublicaciones = true;
        this.errorMensajePublicaciones =
          'La carga de publicaciones tardó demasiado. Verifica el servidor y vuelve a intentar.';
        this.cdr.detectChanges();
      }
    }, 15000);

    console.log('[PERFIL] Iniciando HTTP GET publicaciones');
    this.publicacionesSubscription = this.publicacionesService.getPublicacionesByUsuario(userId).subscribe({
      next: (data: any) => {
        if (this.publicacionesTimeoutId) {
          clearTimeout(this.publicacionesTimeoutId);
          this.publicacionesTimeoutId = null;
        }
        const publicacionesRaw = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        console.log('[PERFIL] HTTP GET publicaciones EXITOSO. Recibidas:', publicacionesRaw.length);
        try {
          this.publicaciones = (publicacionesRaw || [])
            .filter((pub: any) => !!pub)
            .map((pub: any) => ({
              id: pub.id,
              contenido: pub.contenido || '',
              imagen: pub.imagen || '',
              fecha: new Date(pub.createdAt || pub.created_at || Date.now()),
              likes: pub.likesCount ?? pub.reaccionesData?.length ?? pub.likes ?? 0,
              comentarios: pub.comentariosCount ?? pub.comentariosData?.length ?? pub.comentarios ?? 0,
              compartidos: 0
            }));

          this.errorCargaPublicaciones = false;
          this.publicacionesCargadas = true;
        } catch (mapError) {
          console.error('[PERFIL] Error procesando publicaciones:', mapError);
          this.publicaciones = [];
          this.errorCargaPublicaciones = true;
          this.errorMensajePublicaciones =
            'Llegaron datos de publicaciones con un formato inesperado.';
        } finally {
          this.isLoadingPublicaciones = false;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        if (this.publicacionesTimeoutId) {
          clearTimeout(this.publicacionesTimeoutId);
          this.publicacionesTimeoutId = null;
        }
        console.error('Error al cargar publicaciones:', error);
        this.publicaciones = [];
        this.isLoadingPublicaciones = false;
        this.errorCargaPublicaciones = true;

        if (error.status === 0) {
          this.errorMensajePublicaciones = 'No se pudo conectar con el servidor.';
        } else {
          this.errorMensajePublicaciones = 'No se pudieron cargar tus publicaciones. Intenta de nuevo.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  eliminarPublicacion(id: number): void {
    Swal.fire({
      title: '¿Eliminar publicación?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.publicacionesService.deletePublicacion(id).subscribe({
          next: () => {
            this.publicaciones = this.publicaciones.filter(p => p.id !== id);
            Swal.fire('¡Eliminada!', 'La publicación ha sido eliminada.', 'success');
            this.cdr.detectChanges();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la publicación', 'error');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  verCompra(id: number): void {
    console.log('Ver compra:', id);
  }

  irATienda(): void {
    this.router.navigate(['/tienda']);
  }

  irAAdopciones(): void {
    this.router.navigate(['/adopcion']);
  }

  // Mantener por compatibilidad con código existente
  cargarDatosUsuario(): void {
    const userId = this.usuarioLogueado?.id || this.usuarioLogueado?.id_usuario;
    if (userId) {
      this.cargarDatosCompletosUsuario(userId);
    }
  }

  reintentar(): void {
    this.inicializarDatos();
  }

  reintentarPublicaciones(): void {
    this.cargarPublicaciones();
  }

  hasChanges(): boolean {
    if (!this.usuarioOriginal || !this.usuarioEdit) {
      return false;
    }

    return this.usuarioEdit.nombres !== this.usuarioOriginal.nombres ||
           this.usuarioEdit.apellidos !== this.usuarioOriginal.apellidos ||
           this.usuarioEdit.telefono !== this.usuarioOriginal.telefono ||
           this.usuarioEdit.direccion !== this.usuarioOriginal.direccion ||
           this.usuarioEdit.edad !== this.usuarioOriginal.edad;
  }

  guardarPerfil(): void {
    if (!this.usuarioEdit.nombres || !this.usuarioEdit.apellidos) {
      Swal.fire({
        title: 'Campos requeridos',
        text: 'Por favor completa los campos de nombres y apellidos',
        icon: 'warning'
      });
      return;
    }

    const datosActualizar = {
      nombres: this.usuarioEdit.nombres,
      apellidos: this.usuarioEdit.apellidos,
      telefono: this.usuarioEdit.telefono,
      direccion: this.usuarioEdit.direccion,
      edad: this.usuarioEdit.edad
    };

    this.usuariosService.updateUsuario(this.usuarioLogueado.id, datosActualizar).subscribe({
      next: (data) => {
        this.usuarioLogueado = data;
        this.usuarioEdit = { ...data };
        this.usuarioOriginal = { ...data };
        this.authService.updateUserData(data);
        Swal.fire({
          title: '¡Guardado!',
          text: 'Cambios guardados correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          window.location.reload();
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron guardar los cambios',
          icon: 'error'
        });
        console.error('Error al actualizar perfil:', error);
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar la sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Hasta pronto',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        });
      }
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const next = img.nextElementSibling as HTMLElement;
    if (next) next.style.display = 'flex';
  }

  // ===== MODALES =====
  openAddPetModal(): void {
    this.nuevaMascota = {
      nombre: '',
      especie: '',
      raza: '',
      edad: null,
      unidadEdad: 'Años',
      genero: '',
      tamano: '',
      descripcion: ''
    };
    this.nuevaMascotaFoto = null;
    this.showAddPetModal = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.add('modal-open');
    }
  }

  closeAddPetModal(): void {
    this.showAddPetModal = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('modal-open');
    }
  }

  onNuevaMascotaFotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.nuevaMascotaFoto = file;
    }
  }

  guardarNuevaMascota(): void {
    if (!this.nuevaMascota.nombre || !this.nuevaMascota.especie) {
      Swal.fire('Campos requeridos', 'Por favor, ingresa el nombre y la especie de la mascota', 'warning');
      return;
    }

    const mascotaData: any = {
      nombre: this.nuevaMascota.nombre,
      especie: this.nuevaMascota.especie,
      raza: this.nuevaMascota.raza,
      edad: this.nuevaMascota.edad,
      unidadEdad: this.nuevaMascota.unidadEdad,
      sexo: this.nuevaMascota.genero,
      tamano: this.nuevaMascota.tamano,
      descripcion: this.nuevaMascota.descripcion,
      idUsuario: this.usuarioLogueado.id
    };

    const formData = new FormData();
    Object.keys(mascotaData).forEach(key => {
      if (mascotaData[key] !== null && mascotaData[key] !== undefined && mascotaData[key] !== '') {
        formData.append(key, mascotaData[key]);
      }
    });

    if (this.nuevaMascotaFoto) {
      formData.append('foto', this.nuevaMascotaFoto);
    }

    // Realizamos un casting a any para enviar el FormData
    this.mascotasService.createMascota(formData as any).subscribe({
      next: (newPet) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Mascota agregada correctamente',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        
        // Agregar directamente a la lista actual para actualización instantánea en la vista
        if (newPet) {
          // Si el backend devuelve rutas relativas, nos aseguramos de que Angular lo procese correctamente
          if (newPet.foto && !newPet.foto.startsWith('http')) {
            newPet.foto = `http://localhost:3000${newPet.foto}`;
          }
          this.mascotas.push(newPet);
        } else {
          this.cargarMascotas(); // Respaldo si el backend no retorna el objeto
        }
        
        this.closeAddPetModal();
        this.cdr.detectChanges(); // Forzar actualización de la UI inmediatamente
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo agregar la mascota', 'error');
        console.error('Error al crear mascota:', error);
      }
    });
  }

  openEditPetModal(mascota: any): void {
    this.mascotaEdit = {
      ...mascota,
      genero: mascota.genero || mascota.sexo || '',
      unidadEdad: mascota.unidadEdad || mascota.unidad_edad || 'Años'
    };
    this.showEditPetModal = true;
  }

  closeEditPetModal(): void {
    this.showEditPetModal = false;
    this.mascotaEdit = {};
  }

  guardarMascotaEditada(): void {
    if (!this.mascotaEdit?.id || !this.mascotaEdit?.nombre || !this.mascotaEdit?.especie) {
      Swal.fire('Campos requeridos', 'Completa nombre y especie para guardar los cambios.', 'warning');
      return;
    }

    const payload: any = {
      nombre: this.mascotaEdit.nombre,
      especie: this.mascotaEdit.especie,
      raza: this.mascotaEdit.raza,
      edad: this.mascotaEdit.edad,
      unidadEdad: this.mascotaEdit.unidadEdad,
      sexo: this.mascotaEdit.genero,
      tamano: this.mascotaEdit.tamano,
      descripcion: this.mascotaEdit.descripcion
    };

    this.mascotasService.updateMascota(this.mascotaEdit.id, payload).subscribe({
      next: (updatedPet: any) => {
        const index = this.mascotas.findIndex((m) => m.id === this.mascotaEdit.id);
        if (index !== -1) {
          this.mascotas[index] = {
            ...this.mascotas[index],
            ...updatedPet,
            genero: updatedPet?.genero || updatedPet?.sexo || this.mascotaEdit.genero,
            unidadEdad: updatedPet?.unidadEdad || updatedPet?.unidad_edad || this.mascotaEdit.unidadEdad,
            foto: this.getMascotaImageUrl(updatedPet?.foto || this.mascotas[index]?.foto)
          };
        } else {
          this.cargarMascotas();
        }

        this.closeEditPetModal();
        Swal.fire('¡Actualizada!', 'La información de la mascota se actualizó correctamente.', 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al actualizar mascota:', error);
        Swal.fire('Error', 'No se pudo actualizar la información de la mascota.', 'error');
      }
    });
  }

  // ===== FOTO DE PERFIL =====
  getImageUrl(imagen: string | null | undefined): string {
    if (imagen && imagen !== '' && imagen !== 'null' && imagen !== 'undefined') {
      if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
        return imagen;
      }
      if (imagen.startsWith('/uploads')) {
        return `http://localhost:3000${imagen}`;
      }
      return `http://localhost:3000/${imagen}`;
    }
    return 'assets/img/humano.jpg';
  }

  getMascotaImageUrl(imagen: string | null | undefined): string {
    if (!imagen || imagen === 'null' || imagen === 'undefined') {
      return '';
    }
    if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
      return imagen;
    }
    if (imagen.startsWith('/uploads')) {
      return `http://localhost:3000${imagen}`;
    }
    return `http://localhost:3000/${imagen}`;
  }

  onProfilePictureSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: 'Tipo de archivo no válido',
          text: 'Solo se permiten imágenes (JPG, PNG, GIF, WEBP)',
          icon: 'error'
        });
        event.target.value = '';
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          title: 'Archivo muy grande',
          text: 'El tamaño máximo permitido es 10MB',
          icon: 'error'
        });
        event.target.value = '';
        return;
      }

      this.profilePictureFile = file;

      if (this.profilePicturePreview) {
        URL.revokeObjectURL(this.profilePicturePreview);
      }
      this.profilePicturePreview = URL.createObjectURL(file);
    }
  }

  saveProfilePicture(): void {
    this.uploadProfilePicture();
  }

  uploadProfilePicture(): void {
    if (this.profilePictureFile) {
      this.usuariosService.updateProfilePicture(this.usuarioLogueado.id, this.profilePictureFile).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);

          this.usuarioLogueado = { ...this.usuarioLogueado, imagen: data.imagen };
          this.usuarioEdit = { ...this.usuarioEdit, imagen: data.imagen };
          this.usuarioOriginal = { ...this.usuarioOriginal, imagen: data.imagen };

          this.authService.updateUserData({
            ...this.usuarioLogueado,
            imagen: data.imagen
          });

          this.cancelProfilePicture();

          Swal.fire({
            title: '¡Actualizada!',
            text: 'Foto de perfil actualizada correctamente',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            window.location.reload();
          });
          this.cdr.detectChanges();
        },
        error: (error) => {
          Swal.fire('Error', 'No se pudo actualizar la foto de perfil', 'error');
          console.error('Error al actualizar foto:', error);
          this.cdr.detectChanges();
        }
      });
    }
  }

  cancelProfilePicture(): void {
    if (this.profilePicturePreview) {
      URL.revokeObjectURL(this.profilePicturePreview);
    }
    this.profilePicturePreview = null;
    this.profilePictureFile = null;
  }

  removeProfilePicture(): void {
    Swal.fire({
      title: '¿Eliminar foto?',
      text: 'Se usará la imagen por defecto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.deleteProfilePicture(this.usuarioLogueado.id).subscribe({
          next: (data) => {
            this.usuarioLogueado = { ...this.usuarioLogueado, imagen: null };
            this.usuarioEdit = { ...this.usuarioEdit, imagen: null };
            this.usuarioOriginal = { ...this.usuarioOriginal, imagen: null };

            this.authService.updateUserData({
              ...this.usuarioLogueado,
              imagen: null
            });

            Swal.fire('Eliminada', 'Foto de perfil eliminada. Se usará la imagen por defecto.', 'success').then(() => {
              window.location.reload();
            });
            this.cdr.detectChanges();
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar la foto de perfil', 'error');
            console.error('Error al eliminar foto:', error);
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  // ===== TEMA =====
  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('dark-mode', this.darkMode);
      localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    }
  }

  loadTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      this.darkMode = savedTheme === 'dark';
      document.body.classList.toggle('dark-mode', this.darkMode);
    }
  }

  // ===== ELIMINAR CUENTA =====
  deleteAccount(): void {
    Swal.fire({
      title: '¿Eliminar cuenta?',
      text: 'Esta acción es PERMANENTE y no se puede deshacer. Se eliminarán todos tus datos.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar mi cuenta',
      cancelButtonText: 'Cancelar',
      input: 'text',
      inputPlaceholder: 'Escribe "ELIMINAR" para confirmar',
      inputValidator: (value) => {
        if (value !== 'ELIMINAR') {
          return 'Debes escribir "ELIMINAR" para confirmar';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.deleteAccount(this.usuarioLogueado.id).subscribe({
          next: () => {
            Swal.fire('Cuenta eliminada', 'Tu cuenta ha sido eliminada permanentemente', 'success').then(() => {
              this.authService.logout();
              this.router.navigate(['/']);
            });
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar la cuenta', 'error');
            console.error('Error al eliminar cuenta:', error);
          }
        });
      }
    });
  }

  // ===== IR A PÁGINAS =====
  goToHome(): void {
    this.router.navigate(['/usuario']);
  }

  goToRecovery(): void {
    this.router.navigate(['/recovery']);
  }
}
