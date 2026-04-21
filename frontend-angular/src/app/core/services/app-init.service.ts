import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { UsuariosService } from './usuarios.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  private authService = inject(AuthService);
  private usuariosService = inject(UsuariosService);

  async initializeApp(): Promise<void> {
    // Solo ejecutar en el navegador
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    const token = this.authService.getToken();
    
    // Si hay token válido, cargar datos completos del usuario
    if (token && this.authService.isAuthenticated()) {
      try {
        const user = this.authService.getUser();
        
        if (user?.id) {
          // Cargar datos completos del usuario desde el backend
          const fullUserData = await firstValueFrom(
            this.usuariosService.getUsuario(user.id)
          );
          
          // Actualizar localStorage con datos completos incluyendo imagen
          this.authService.updateUserData(fullUserData);
        }
      } catch (error) {
        // No hacer logout, mantener datos del token
        // El usuario podrá seguir usando la app con los datos básicos del token
        console.warn('No se pudieron cargar datos del usuario:', error);
      }
    }
  }
}
