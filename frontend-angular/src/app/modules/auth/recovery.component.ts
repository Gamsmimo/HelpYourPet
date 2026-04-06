import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent {
  email = '';
  loading = false;

  onSubmit(): void {
    this.loading = true;
    
    // TODO: Conectar con servicio de recuperación
    setTimeout(() => {
      this.loading = false;
      Swal.fire({
        icon: 'success',
        title: 'Correo Enviado',
        text: 'Revisa tu bandeja de entrada para restablecer tu contraseña'
      });
    }, 1500);
  }
}
