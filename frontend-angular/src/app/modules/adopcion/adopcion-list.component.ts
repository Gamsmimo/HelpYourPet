import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adopcion-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <h2>Mascotas en Adopción</h2>
      <p class="text-muted">Encuentra tu nuevo mejor amigo</p>
      <div class="row g-4 mt-3">
        <div class="col-md-4">
          <div class="card">
            <img src="assets/img/pet-placeholder.jpg" class="card-img-top" alt="Mascota">
            <div class="card-body">
              <h5 class="card-title">Nombre de la mascota</h5>
              <p class="card-text">Descripción de la mascota en adopción</p>
              <button class="btn btn-primary">Ver Detalles</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdopcionListComponent {}
