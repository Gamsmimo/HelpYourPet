import { Component, OnInit, AfterViewInit } from '@angular/core';
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
export class PerfilComponent implements OnInit, AfterViewInit {
  usuarioLogueado: any = null;
  mascotas: any[] = [];
  tieneMascotas = false;
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
    this.usuarioLogueado = this.authService.getUser();
    this.cargarMascotas();
  }

  ngAfterViewInit(): void {
    this.initializeScripts();
  }

  initializeScripts(): void {
    setTimeout(() => {
      this.setupNavigation();
      this.setupMenuToggle();
      this.setupThemeToggle();
    }, 100);
  }

  setupNavigation(): void {
    if (typeof document !== 'undefined') {
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = link.getAttribute('href');
          if (target) {
            this.showSection(target.replace('#', ''));
          }
        });
      });
    }
  }

  setupMenuToggle(): void {
    if (typeof document !== 'undefined') {
      const menuToggles = document.querySelectorAll('.menu-toggle');
      menuToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
          this.toggleSidebar();
        });
      });
    }
  }

  setupThemeToggle(): void {
    if (typeof document !== 'undefined') {
      const themeToggles = document.querySelectorAll('.theme-toggle-checkbox');
      themeToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
          document.body.classList.toggle('dark-mode');
        });
      });
    }
  }

  cargarMascotas(): void {
    this.mascotasService.getMisMascotas().subscribe({
      next: (data) => {
        this.mascotas = data;
        this.tieneMascotas = data.length > 0;
      },
      error: (error) => {
        console.error('Error al cargar mascotas:', error);
      }
    });
  }

  cargarCompras(): void {
    // TODO: Implementar servicio de compras
    this.compras = [];
  }

  cargarCitas(): void {
    // TODO: Implementar servicio de citas
    this.citas = [];
  }

  cargarAdopciones(): void {
    // TODO: Implementar servicio de adopciones
    this.adopciones = [];
  }

  showSection(sectionId: string): void {
    this.activeSection = sectionId;
    
    if (typeof document !== 'undefined') {
      // Ocultar todas las secciones
      const sections = document.querySelectorAll('.content-section');
      sections.forEach(section => {
        (section as HTMLElement).style.display = 'none';
      });
      
      // Mostrar la sección seleccionada
      const selectedSection = document.getElementById(sectionId);
      if (selectedSection) {
        selectedSection.style.display = 'block';
      }
      
      // Actualizar nav links
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.classList.remove('active');
      });
      
      const activeLink = document.querySelector(`[href="#${sectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
    
    // Cargar datos según la sección
    switch(sectionId) {
      case 'mascotas':
        this.cargarMascotas();
        break;
      case 'compras':
        this.cargarCompras();
        break;
      case 'citas':
        this.cargarCitas();
        break;
      case 'adopcion':
        this.cargarAdopciones();
        break;
    }
  }

  toggleSidebar(): void {
    if (typeof document !== 'undefined') {
      this.sidebarOpen = !this.sidebarOpen;
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      
      if (sidebar && overlay) {
        if (this.sidebarOpen) {
          sidebar.classList.add('active');
          overlay.classList.add('active');
        } else {
          sidebar.classList.remove('active');
          overlay.classList.remove('active');
        }
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  eliminarMascota(id: number): void {
    Swal.fire({
      title: '¿Eliminar mascota?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mascotasService.deleteMascota(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminada!', 'La mascota ha sido eliminada.', 'success');
            this.cargarMascotas();
          },
          error: (error: any) => {
            Swal.fire('Error', 'No se pudo eliminar la mascota', 'error');
          }
        });
      }
    });
  }

  guardarPerfil(): void {
    Swal.fire({
      title: 'Guardando cambios...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // TODO: Implementar servicio para actualizar perfil
    setTimeout(() => {
      Swal.fire({
        title: '¡Guardado!',
        text: 'Los cambios han sido guardados correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }, 1000);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const next = img.nextElementSibling as HTMLElement;
    if (next) {
      next.style.display = 'flex';
    }
  }

  onImageErrorTable(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const next = img.nextElementSibling as HTMLElement;
    if (next) {
      next.style.display = 'inline-block';
    }
  }
}
