import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <h2>Tienda de Productos</h2>
      <p class="text-muted">Encuentra todo lo que necesitas para tu mascota</p>
      <div class="row g-4 mt-3">
        <div class="col-md-3">
          <div class="card">
            <img src="assets/img/product-placeholder.jpg" class="card-img-top" alt="Producto">
            <div class="card-body">
              <h5 class="card-title">Producto</h5>
              <p class="card-text">$50.000</p>
              <button class="btn btn-primary">Agregar al Carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TiendaComponent {}
