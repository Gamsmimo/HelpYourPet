import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-veterinarias',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <h2>Gestión de Veterinarias</h2>
      <p class="text-muted">Administra las veterinarias registradas</p>
      <!-- Aquí irá la tabla de veterinarias -->
    </div>
  `
})
export class VeterinariasComponent {}
