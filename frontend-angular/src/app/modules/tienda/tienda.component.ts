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
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23ddd' width='300' height='200'/%3E%3Ctext fill='rgba(0,0,0,0.5)' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EProducto%3C/text%3E%3C/svg%3E" class="card-img-top" alt="Producto">
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
