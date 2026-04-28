import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <h2>Servicios Veterinarios</h2>
      <p class="text-muted">Encuentra los mejores servicios para tu mascota</p>
      <div class="row g-4 mt-3">
        <div class="col-md-4">
          <div class="card">
            <div class="card-body text-center">
              <i class="fas fa-stethoscope fa-3x text-primary mb-3"></i>
              <h5 class="card-title">Consulta General</h5>
              <p class="card-text">Revisión completa de tu mascota</p>
              <button class="btn btn-primary">Agendar</button>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body text-center">
              <i class="fas fa-syringe fa-3x text-success mb-3"></i>
              <h5 class="card-title">Vacunación</h5>
              <p class="card-text">Mantén al día las vacunas</p>
              <button class="btn btn-success">Agendar</button>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body text-center">
              <i class="fas fa-cut fa-3x text-info mb-3"></i>
              <h5 class="card-title">Peluquería</h5>
              <p class="card-text">Servicio de grooming profesional</p>
              <button class="btn btn-info">Agendar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ServiciosComponent {}
