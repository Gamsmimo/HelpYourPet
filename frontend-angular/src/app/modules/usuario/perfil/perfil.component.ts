import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MascotasService } from '../../../core/services/mascotas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuarioLogueado: any = {};
  mascotas: any[] = [];
  activeSection = 'dashboard';
  sidebarOpen = false;
  compras: any[] = [];
  citas: any[] = [];
  adopciones: any[] = [];

  constructor(
    private authService: AuthService,
    private mascotasService: MascotasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioLogueado = this.authService.getUser() || {};
    this.cargarMascotas();
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

  guardarPerfil(): void {
    Swal.fire({ title: '¡Guardado!', text: 'Cambios guardados correctamente', icon: 'success', timer: 2000, showConfirmButton: false });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const next = img.nextElementSibling as HTMLElement;
    if (next) next.style.display = 'flex';
  }
}
