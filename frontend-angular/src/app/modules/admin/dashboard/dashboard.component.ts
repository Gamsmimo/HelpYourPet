import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col">
          <h2>Panel de Administración</h2>
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
                  <h6 class="card-title">Usuarios</h6>
                  <h3 class="mb-0">150</h3>
                </div>
                <i class="fas fa-users fa-3x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Veterinarias</h6>
                  <h3 class="mb-0">25</h3>
                </div>
                <i class="fas fa-hospital fa-3x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Mascotas</h6>
                  <h3 class="mb-0">320</h3>
                </div>
                <i class="fas fa-paw fa-3x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Citas</h6>
                  <h3 class="mb-0">89</h3>
                </div>
                <i class="fas fa-calendar fa-3x opacity-50"></i>
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
                <a routerLink="/admin/usuarios" class="btn btn-outline-primary">
                  <i class="fas fa-users me-2"></i>Gestionar Usuarios
                </a>
                <a routerLink="/admin/veterinarias" class="btn btn-outline-success">
                  <i class="fas fa-hospital me-2"></i>Gestionar Veterinarias
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Actividad Reciente</h5>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li class="mb-2">
                  <i class="fas fa-user-plus text-success me-2"></i>
                  Nuevo usuario registrado
                </li>
                <li class="mb-2">
                  <i class="fas fa-calendar text-info me-2"></i>
                  Nueva cita agendada
                </li>
                <li class="mb-2">
                  <i class="fas fa-hospital text-primary me-2"></i>
                  Veterinaria actualizada
                </li>
              </ul>
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
