import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <h2>Mis Pacientes</h2>
      <p class="text-muted">Lista de pacientes atendidos</p>
    </div>
  `
})
export class PacientesComponent {}
