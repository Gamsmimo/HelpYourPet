import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-veterinario-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col">
          <h2>Panel de Veterinario</h2>
          <p class="text-muted">Bienvenido, {{ user?.correo }}</p>
        </div>
        <div class="col-auto">
          <button class="btn btn-outline-danger" (click)="logout()">
            <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
          </button>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Citas Hoy</h6>
                  <h3 class="mb-0">8</h3>
                </div>
                <i class="fas fa-calendar-day fa-3x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Pacientes</h6>
                  <h3 class="mb-0">45</h3>
                </div>
                <i class="fas fa-paw fa-3x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Pendientes</h6>
                  <h3 class="mb-0">3</h3>
                </div>
                <i class="fas fa-clock fa-3x opacity-50"></i>
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
                <a routerLink="/veterinario/citas" class="btn btn-outline-primary">
                  <i class="fas fa-calendar me-2"></i>Ver Mis Citas
                </a>
                <a routerLink="/veterinario/pacientes" class="btn btn-outline-success">
                  <i class="fas fa-paw me-2"></i>Ver Pacientes
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
              <p class="text-muted">No hay citas programadas para hoy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  user: any;

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
  }
}
