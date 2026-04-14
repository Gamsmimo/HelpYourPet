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
          // Actualizar en AuthService
          this.authService.updateUserData(data);
        },
        error: (error) => {
          console.error('Error al cargar datos del usuario:', error);
        }
      });
    }
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
  onProfilePictureSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profilePictureFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicturePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfilePicture(): void {
    if (this.profilePictureFile) {
      this.usuariosService.updateProfilePicture(this.usuarioLogueado.id, this.profilePictureFile).subscribe({
        next: (data) => {
          this.usuarioLogueado.imagen = data.imagen;
          this.authService.updateUserData(data);
          Swal.fire('¡Guardado!', 'Foto de perfil actualizada', 'success');
          this.profilePicturePreview = null;
          this.profilePictureFile = null;
        },
        error: (error) => {
          Swal.fire('Error', 'No se pudo actualizar la foto de perfil', 'error');
          console.error('Error al actualizar foto:', error);
        }
      });
    }
  }

  cancelProfilePicture(): void {
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
            this.usuarioLogueado.imagen = null;
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
