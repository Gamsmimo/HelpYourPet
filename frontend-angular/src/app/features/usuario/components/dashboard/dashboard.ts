import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-usuario-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col">
          <h2>Mi Panel</h2>
          <p class="text-muted">Bienvenido, {{ user?.correo }}</p>
        </div>
        <div class="col-auto">
          <button class="btn btn-outline-danger" (click)="logout()">
            <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
          </button>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Mis Mascotas</h6>
                  <h3 class="mb-0">3</h3>
                </div>
                <i class="fas fa-paw fa-3x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Citas</h6>
                  <h3 class="mb-0">2</h3>
                </div>
                <i class="fas fa-calendar fa-3x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Compras</h6>
                  <h3 class="mb-0">5</h3>
                </div>
                <i class="fas fa-shopping-cart fa-3x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Notificaciones</h6>
                  <h3 class="mb-0">1</h3>
                </div>
                <i class="fas fa-bell fa-3x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Acciones Rápidas</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <a routerLink="/usuario/mascotas" class="btn btn-outline-primary">
                  <i class="fas fa-paw me-2"></i>Ver Mis Mascotas
                </a>
                <a routerLink="/usuario/citas" class="btn btn-outline-info">
                  <i class="fas fa-calendar me-2"></i>Mis Citas
                </a>
                <a routerLink="/usuario/perfil" class="btn btn-outline-success">
                  <i class="fas fa-user me-2"></i>Mi Perfil
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Próximas Citas</h5>
            </div>
            <div class="card-body">
              <p class="text-muted">No tienes citas programadas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  user: any = null;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true;
    this.user = this.authService.getUser();
    
    // Validar que el usuario existe antes de renderizar
    if (!this.user) {
      console.warn('No se encontró usuario en el dashboard');
      this.authService.logout();
      return;
    }
    
    this.isLoading = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
