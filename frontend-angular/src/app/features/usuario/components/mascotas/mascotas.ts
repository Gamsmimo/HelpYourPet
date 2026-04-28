import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <h2>Mis Mascotas</h2>
      <p class="text-muted">Gestiona tus mascotas</p>
    </div>
  `
})
export class MascotasComponent {}
