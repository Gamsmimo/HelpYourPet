import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginDto, RegisterDto, AuthResponse, User } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.access_token);
        this.setUserFromToken(response.access_token);
      })
    );
  }

  register(data: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(response => {
        this.setToken(response.access_token);
        this.setUserFromToken(response.access_token);
      })
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  setToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  setUserFromToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const decoded: any = jwtDecode(token);
        const user = {
          id: decoded.sub,
          correo: decoded.correo,
          rol_id: decoded.idRol,
          rol: decoded.nombreRol
        };
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  isAuthenticated(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
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
    switch(role) {
      case 1:
        this.router.navigate(['/admin']);
        break;
      case 2:
        this.router.navigate(['/veterinario']);
        break;
      case 3:
        this.router.navigate(['/usuario']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
