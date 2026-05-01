import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { LoginDto } from '../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './log-in.html',
  styleUrls: ['./log-in.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials: LoginDto = {
    correo: '',
    contrasena: ''
  };

  showPassword = false;
  loading = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.loading = true;
    
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.loading = false;
        // Redirigir inmediatamente
        this.authService.redirectByRole();
        
        // Mostrar mensaje después de redirigir
        setTimeout(() => {
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Has iniciado sesión correctamente',
            timer: 1500,
            showConfirmButton: false
          });
        }, 100);
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Credenciales incorrectas'
        });
      }
    });
  }
}
