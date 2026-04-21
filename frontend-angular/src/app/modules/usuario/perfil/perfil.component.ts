import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MascotasService } from '../../../core/services/mascotas.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { AdopcionService } from '../../../core/services/adopcion.service';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
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
  usuarioEdit: any = {}; // Copia para editar
  usuarioOriginal: any = {}; // Copia original para comparar cambios
  mascotas: any[] = [];
  activeSection = 'dashboard';
  sidebarOpen = false;
  compras: any[] = [];
  citas: any[] = [];
  adopciones: any[] = [];
  publicaciones: any[] = [];
  
  // Modales
  showAddPetModal = false;
  showEditPetModal = false;
  
  // Mascota en edición
  mascotaEdit: any = {};
  
  // Foto de perfil
  profilePicturePreview: string | null = null;
  profilePictureFile: File | null = null;
  
  // Tema
  darkMode = false;

  // Estado de carga
  isLoadingUser = true;
  isLoadingPublicaciones = true;
  userImageLoaded = false;
  dataInitialized = false;

  // Suscripción a navegación
  private navigationSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private mascotasService: MascotasService,
    private usuariosService: UsuariosService,
    private adopcionService: AdopcionService,
    private publicacionesService: PublicacionesService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Inicializar datos inmediatamente
    this.inicializarDatos();
    
    // Suscribirse a eventos de navegación para recargar cuando se vuelve a esta ruta
    this.navigationSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/usuario/perfil' || event.urlAfterRedirects === '/usuario/perfil') {
          this.inicializarDatos();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  inicializarDatos(): void {
    this.isLoadingUser = true;
    this.isLoadingPublicaciones = true;
    this.dataInitialized = false;
    
    // Obtener datos completos del usuario desde localStorage (ya hidratados por AppInitService)
    const userData = this.authService.getUser();
    const userId = userData?.id || userData?.id_usuario;
    
    if (!userId) {
      console.error('No se encontró ID de usuario en el token');
      this.isLoadingUser = false;
      this.isLoadingPublicaciones = false;
      return;
    }
    
    // Asignar datos completos del usuario (incluyendo imagen si ya fue hidratada)
    this.usuarioLogueado = { ...userData, id: userId };
    this.usuarioEdit = { ...userData, id: userId };
    this.usuarioOriginal = { ...userData, id: userId };
    
    // Si ya hay imagen en los datos, marcar como cargada
    if (userData?.imagen) {
      this.userImageLoaded = true;
      this.isLoadingUser = false;
      this.dataInitialized = true;
    }
    
    // Cargar/actualizar datos completos del usuario desde el backend
    this.cargarDatosUsuarioYPublicaciones(userId);
    this.cargarMascotas();
    this.loadTheme();
  }

  private cargarDatosUsuarioYPublicaciones(userId: number): void {
    this.usuariosService.getUsuario(userId).subscribe({
      next: (data) => {
        this.usuarioLogueado = { ...data, id: userId };
        this.usuarioEdit = { ...data, id: userId };
        this.usuarioOriginal = { ...data, id: userId };
        this.isLoadingUser = false;
        this.userImageLoaded = true;
        this.dataInitialized = true;
        
        // Actualizar en AuthService para que esté disponible en toda la app
        this.authService.updateUserData(data);
        
        // Cargar publicaciones automáticamente
        this.cargarPublicacionesInterno(userId);
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
        this.isLoadingUser = false;
        this.dataInitialized = true;
        // Intentar cargar publicaciones incluso si falla la carga del usuario
        this.cargarPublicacionesInterno(userId);
      }
    });
  }

  showSection(sectionId: string): void {
    this.activeSection = sectionId;
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.sidebarOpen = false;
    }
    switch (sectionId) {
      case 'mascotas': this.cargarMascotas(); break;
      case 'compras':  this.cargarCompras();  break;
      case 'adopciones-usuario': 
        // Solo recargar si ya se habían cargado antes
        if (this.publicaciones.length > 0 || !this.isLoadingPublicaciones) {
          this.cargarPublicaciones(); 
        }
        break;
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  cargarMascotas(): void {
    if (this.usuarioLogueado?.id) {
      this.mascotasService.getMascotasByUsuario(this.usuarioLogueado.id).subscribe({
        next: (data) => { this.mascotas = data; },
        error: () => { this.mascotas = []; }
      });
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

  cargarPublicaciones(): void {
    const userId = this.usuarioLogueado?.id || this.usuarioLogueado?.id_usuario;
    if (userId) {
      this.cargarPublicacionesInterno(userId);
    }
  }

  private cargarPublicacionesInterno(userId: number): void {
    this.isLoadingPublicaciones = true;
    this.publicacionesService.getPublicacionesByUsuario(userId).subscribe({
      next: (data) => {
        this.publicaciones = data.map(pub => ({
          id: pub.id,
          contenido: pub.contenido,
          imagen: pub.imagen,
          fecha: new Date(pub.createdAt),
          likes: pub.likesCount || pub.reaccionesData?.length || 0,
          comentarios: pub.comentariosCount || pub.comentariosData?.length || 0,
          compartidos: 0
        }));
        this.isLoadingPublicaciones = false;
      },
      error: (error) => {
        console.error('Error al cargar publicaciones:', error);
        this.publicaciones = [];
        this.isLoadingPublicaciones = false;
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
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la publicación', 'error');
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

  cargarDatosUsuario(): void {
    // Este método ahora es un wrapper para compatibilidad
    const userId = this.usuarioLogueado?.id || this.usuarioLogueado?.id_usuario;
    if (userId) {
      this.usuariosService.getUsuario(userId).subscribe({
        next: (data) => {
          console.log('Datos del usuario recibidos:', data);
          this.usuarioLogueado = { ...data, id: userId };
          this.usuarioEdit = { ...data, id: userId };
          this.usuarioOriginal = { ...data, id: userId };
          this.isLoadingUser = false;
          this.userImageLoaded = true;
          this.dataInitialized = true;
          this.authService.updateUserData(data);
        },
        error: (error) => {
          console.error('Error al cargar datos del usuario:', error);
          this.isLoadingUser = false;
          this.dataInitialized = true;
        }
      });
    } else {
      this.isLoadingUser = false;
      this.dataInitialized = true;
    }
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
        this.usuarioOriginal = { ...data }; // Actualizar copia original
        this.authService.updateUserData(data);
        Swal.fire({
          title: '¡Guardado!',
          text: 'Cambios guardados correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron guardar los cambios',
          icon: 'error'
        });
        console.error('Error al actualizar perfil:', error);
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
    this.showAddPetModal = true;
  }

  closeAddPetModal(): void {
    this.showAddPetModal = false;
  }

  openEditPetModal(mascota: any): void {
    this.mascotaEdit = { ...mascota };
    this.showEditPetModal = true;
  }

  closeEditPetModal(): void {
    this.showEditPetModal = false;
    this.mascotaEdit = {};
  }

  // ===== FOTO DE PERFIL =====
  getImageUrl(imagen: string | null | undefined): string {
    // Jerarquía simple: Imagen de Usuario > Imagen por Defecto
    
    // Si hay imagen del usuario, procesarla
    if (imagen && imagen !== '' && imagen !== 'null' && imagen !== 'undefined') {
      // Si la imagen ya tiene http:// o https://, retornarla tal cual
      if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
        return imagen;
      }
      // Si empieza con /uploads, agregar la URL del servidor
      if (imagen.startsWith('/uploads')) {
        return `http://localhost:3000${imagen}`;
      }
      // Si es una ruta relativa, agregar la URL del servidor
      return `http://localhost:3000/${imagen}`;
    }
    
    // Si no hay imagen, retornar imagen por defecto
    return 'assets/img/humano.jpg';
  }

  onProfilePictureSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
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

      // Validar tamaño (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
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
      
      // Crear preview usando createObjectURL (más rápido que FileReader)
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
          
          // Actualizar todos los objetos con la nueva imagen
          this.usuarioLogueado = { ...this.usuarioLogueado, imagen: data.imagen };
          this.usuarioEdit = { ...this.usuarioEdit, imagen: data.imagen };
          this.usuarioOriginal = { ...this.usuarioOriginal, imagen: data.imagen };
          
          // Actualizar en AuthService para sincronizar con toda la app
          this.authService.updateUserData({
            ...this.usuarioLogueado,
            imagen: data.imagen
          });
          
          // Limpiar preview
          this.cancelProfilePicture();
          
          Swal.fire({
            title: '¡Actualizada!',
            text: 'Foto de perfil actualizada correctamente',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (error) => {
          Swal.fire('Error', 'No se pudo actualizar la foto de perfil', 'error');
          console.error('Error al actualizar foto:', error);
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
            // Actualizar todos los objetos con imagen vacía o null
            this.usuarioLogueado = { ...this.usuarioLogueado, imagen: null };
            this.usuarioEdit = { ...this.usuarioEdit, imagen: null };
            this.usuarioOriginal = { ...this.usuarioOriginal, imagen: null };
            
            // Actualizar en AuthService para sincronizar con toda la app
            this.authService.updateUserData({
              ...this.usuarioLogueado,
              imagen: null
            });
            
            Swal.fire('Eliminada', 'Foto de perfil eliminada. Se usará la imagen por defecto.', 'success');
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar la foto de perfil', 'error');
            console.error('Error al eliminar foto:', error);
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
