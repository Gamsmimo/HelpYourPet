import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-citas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <h2>Mis Citas</h2>
      <p class="text-muted">Gestiona tus citas veterinarias</p>
    </div>
  `
})
export class CitasComponent {}
