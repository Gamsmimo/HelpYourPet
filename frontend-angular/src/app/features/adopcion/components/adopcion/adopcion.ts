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
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23e3f2fd' width='300' height='200'/%3E%3Ctext fill='rgba(0,0,0,0.5)' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EMascota%3C/text%3E%3C/svg%3E" class="card-img-top" alt="Mascota">
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
