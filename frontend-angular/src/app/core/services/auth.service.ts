import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginDto, RegisterDto, AuthResponse, User } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';
import { APP_PATHS, ROLE_HOME_PATH } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  private getModuleRouteByRole(role: number): string {
    return ROLE_HOME_PATH[role] ?? `/${APP_PATHS.LOGIN}`;
  }

  private logLoginModuleData(source: 'login' | 'register'): void {
    if (environment.production) return;

    const user = this.getUser();
    const role = Number(user?.rol_id || 0);
    const moduleRoute = this.getModuleRouteByRole(role);

    console.groupCollapsed(`[AUTH] ${source} exitoso -> modulo destino`);
    console.log('usuario:', user);
    console.log('rol_id:', role);
    console.log('rol:', user?.rol || 'SIN_ROL');
    console.log('moduloRuta:', moduleRoute);
    console.groupEnd();
  }

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        // El token ahora se maneja con cookies httpOnly, no se guarda en localStorage
        // Solo guardamos los datos del usuario
        if ((response as any).user) {
          this.updateUserData((response as any).user);
        }

        this.logLoginModuleData('login');
      })
    );
  }

  register(data: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(response => {
        // El token ahora se maneja con cookies httpOnly, no se guarda en localStorage
        // Solo guardamos los datos del usuario
        if ((response as any).user) {
          this.updateUserData((response as any).user);
        }

        this.logLoginModuleData('register');
      })
    );
  }

  logout(): void {
    // Llamar al endpoint de logout para limpiar la cookie en el servidor
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
      next: () => {
        this.clearUserData();
        this.router.navigate([`/${APP_PATHS.LOGIN}`]);
      },
      error: () => {
        // Incluso si falla, limpiar datos locales y redirigir
        this.clearUserData();
        this.router.navigate([`/${APP_PATHS.LOGIN}`]);
      }
    });
  }

  clearUserData(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  getToken(): string | null {
    // Ya no usamos localStorage para el token
    // El token se maneja automáticamente via cookies httpOnly
    return null;
  }

  setToken(token: string): void {
    // Ya no usamos localStorage para el token
    // El token se maneja automáticamente via cookies httpOnly
  }

  setUserFromToken(token: string): void {
    // Ya no decodificamos el token en el frontend
    // Los datos del usuario vienen del backend en login/register
  }

  isAuthenticated(): boolean {
    // Verificamos autenticación basándonos en si tenemos datos de usuario
    // La cookie httpOnly se valida en el servidor
    if (typeof localStorage === 'undefined') {
      return false;
    }
    
    const user = this.getUser();
    return user !== null;
  }

  getUser(): any {
    if (typeof localStorage !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  updateUserData(userData: any): void {
    if (typeof localStorage !== 'undefined') {
      const currentUser = this.getUser();
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }

  getUserRole(): number {
    const user = this.getUser();
    return user?.rol_id || 0;
  }

  redirectByRole(): void {
    const role = this.getUserRole();
    const moduleRoute = this.getModuleRouteByRole(role);
    this.router.navigate([moduleRoute]);
  }
}
