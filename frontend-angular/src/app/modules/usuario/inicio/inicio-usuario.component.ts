import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-inicio-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio-usuario.component.html',
  styleUrls: ['./inicio-usuario.component.css']
})
export class InicioUsuarioComponent implements OnInit {
  usuarioLogueado: any = null;
  eventos: any[] = [];
  currentPage = 0;
  totalPages = 1;
  modalActive = false;
  selectedVeterinaria: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.usuarioLogueado = this.authService.getUser();
    this.cargarEventos();
    this.initializeScripts();
  }

  cargarEventos(): void {
    // TODO: Implementar servicio de eventos
    this.eventos = [];
  }

  initializeScripts(): void {
    setTimeout(() => {
      this.initThemeToggle();
      this.initSearch();
      this.initScrollToTop();
      this.initHamburgerMenu();
    }, 100);
  }

  initThemeToggle(): void {
    if (typeof document !== 'undefined') {
      const themeToggle = document.getElementById('themeToggle') as HTMLInputElement;
      if (themeToggle) {
        themeToggle.addEventListener('change', () => {
          document.body.classList.toggle('dark-mode');
        });
      }
    }
  }

  initSearch(): void {
    if (typeof document !== 'undefined') {
      const searchInput = document.getElementById('searchInput') as HTMLInputElement;
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const query = (e.target as HTMLInputElement).value;
          // Implementar lógica de búsqueda
        });
      }
    }
  }

  initScrollToTop(): void {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      const btnInicio = document.querySelector('.btn-inicio');
      if (btnInicio) {
        window.addEventListener('scroll', () => {
          if (window.scrollY > 300) {
            btnInicio.classList.add('show');
          } else {
            btnInicio.classList.remove('show');
          }
        });
      }
    }
  }

  initHamburgerMenu(): void {
    if (typeof document !== 'undefined') {
      const hamburgerBtn = document.querySelector('.hamburger-btn');
      const menuContent = document.querySelector('.menu-content');
      
      if (hamburgerBtn && menuContent) {
        hamburgerBtn.addEventListener('click', () => {
          menuContent.classList.toggle('active');
        });
      }
    }
  }

  openModal(veterinaria: any): void {
    this.selectedVeterinaria = veterinaria;
    this.modalActive = true;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(): void {
    this.modalActive = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
