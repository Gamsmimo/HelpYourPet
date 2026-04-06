import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = '';
  newPassword = '';
  confirmPassword = '';
  showNewPassword = false;
  showConfirmPassword = false;
  loading = false;
  tokenValido = true;
  passwordStrength = 0;
  strengthText = 'Débil';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.tokenValido = false;
    }
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onPasswordChange(): void {
    this.calculatePasswordStrength();
  }

  calculatePasswordStrength(): void {
    const password = this.newPassword;
    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    this.passwordStrength = Math.min(strength, 4);
    
    const strengthTexts = ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
    this.strengthText = strengthTexts[this.passwordStrength];
  }

  passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword && this.confirmPassword.length > 0;
  }

  isFormValid(): boolean {
    return this.newPassword.length >= 6 && this.passwordsMatch();
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.loading = true;

    // TODO: Conectar con servicio de reset password
    setTimeout(() => {
      this.loading = false;
      Swal.fire({
        icon: 'success',
        title: 'Contraseña Restablecida',
        text: 'Tu contraseña ha sido actualizada correctamente',
        confirmButtonText: 'Ir al Login'
      }).then(() => {
        this.router.navigate(['/login']);
      });
    }, 1500);
  }
}
