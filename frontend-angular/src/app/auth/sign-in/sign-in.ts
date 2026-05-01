import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { RegisterDto } from '../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.scss']
})
export class SignInComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  formData: RegisterDto = {
    nombre: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    tipo_documento: '',
    num_documento: '',
    edad: 18,
    telefono: '',
    direccion: ''
  };
  confirmPassword = '';
  aceptoTerminos = false;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.formData.contrasena !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    if (!this.aceptoTerminos) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debes aceptar los términos y condiciones'
      });
      return;
    }

    this.loading = true;
    
    this.authService.register(this.formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Registro Exitoso!',
          text: 'Tu cuenta ha sido creada correctamente',
          timer: 1500,
          showConfirmButton: false
        });
        this.authService.redirectByRole();
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Error al registrar usuario'
        });
      }
    });
  }

  showTerms(): void {
    Swal.fire({
      title: 'Términos y Condiciones',
      html: '<p>Aquí van los términos y condiciones de uso de la plataforma...</p>',
      confirmButtonText: 'Aceptar'
    });
  }
}
