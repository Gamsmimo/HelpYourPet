import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MascotasService } from '../../../core/services/mascotas.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuarioLogueado: any = {};
  usuarioEdit: any = {}; // Copia para editar
  usuarioOriginal: any = {}; // Copia original para comparar cambios
  mascotas: any[] = [];
  activeSection = 'dashboard';
  sidebarOpen = false;
  compras: any[] = [];
  citas: any[] = [];
  adopciones: any[] = [];
  
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

  constructor(
    private authService: AuthService,
    private mascotasService: MascotasService,
    private usuariosService: UsuariosService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.usuarioLogueado = this.authService.getUser() || {};
    this.cargarDatosUsuario();
    this.cargarMascotas();
    this.loadTheme();
  }

  showSection(sectionId: string): void {
    this.activeSection = sectionId;
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.sidebarOpen = false;
    }
    switch (sectionId) {
      case 'mascotas': this.cargarMascotas(); break;
      case 'compras':  this.cargarCompras();  break;
      case 'adopciones': this.cargarAdopciones(); break;
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  cargarMascotas(): void {
    this.mascotasService.getMisMascotas().subscribe({
      next: (data) => { this.mascotas = data; },
      error: () => { this.mascotas = []; }
    });
  }

  cargarCompras(): void { this.compras = []; }

  cargarAdopciones(): void { this.adopciones = []; }

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
    if (this.usuarioLogueado.id) {
      this.usuariosService.getUsuario(this.usuarioLogueado.id).subscribe({
        next: (data) => {
          console.log('Datos del usuario recibidos:', data);
          this.usuarioLogueado = data;
          this.usuarioEdit = { ...data };
          this.usuarioOriginal = { ...data }; // Guardar copia original
          // Actualizar en AuthService
          this.authService.updateUserData(data);
        },
        error: (error) => {
          console.error('Error al cargar datos del usuario:', error);
        }
      });
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
    if (!imagen || imagen === '') {
      return 'assets/IMG/humano.jpg';
    }
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
    if (this.profilePictureFile) {
      this.usuariosService.updateProfilePicture(this.usuarioLogueado.id, this.profilePictureFile).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);
          
          // Actualizar todos los objetos con la nueva imagen
          this.usuarioLogueado.imagen = data.imagen;
          this.usuarioEdit.imagen = data.imagen;
          this.usuarioOriginal.imagen = data.imagen;
          
          // Actualizar en AuthService para sincronizar con sidebar
          this.authService.updateUserData({
            ...this.usuarioLogueado,
            imagen: data.imagen
          });
          
          // Limpiar preview y archivo
          if (this.profilePicturePreview) {
            URL.revokeObjectURL(this.profilePicturePreview);
          }
          this.profilePicturePreview = null;
          this.profilePictureFile = null;
          
          // Forzar detección de cambios
          setTimeout(() => {
            this.usuarioLogueado = { ...this.usuarioLogueado };
          }, 100);
          
          Swal.fire('¡Guardado!', 'Foto de perfil actualizada', 'success');
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
            // Actualizar todos los objetos
            this.usuarioLogueado.imagen = '';
            this.usuarioEdit.imagen = '';
            this.usuarioOriginal.imagen = '';
            
            // Actualizar en AuthService para sincronizar con sidebar
            this.authService.updateUserData(data);
            
            Swal.fire('Eliminada', 'Foto de perfil eliminada', 'success');
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
