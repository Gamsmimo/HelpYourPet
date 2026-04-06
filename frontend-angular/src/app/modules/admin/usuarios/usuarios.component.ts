import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <h2>Gestión de Usuarios</h2>
      <p class="text-muted">Administra los usuarios del sistema</p>
      <!-- Aquí irá la tabla de usuarios -->
    </div>
  `
})
export class UsuariosComponent {}
