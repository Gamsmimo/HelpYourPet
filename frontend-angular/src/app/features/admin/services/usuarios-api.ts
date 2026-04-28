import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuariosApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarios/${id}`);
  }

  create(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios`, payload);
  }

  update(id: number, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/usuarios/${id}`, payload);
  }

  uploadFoto(file: File): Observable<{ fotoUrl: string }> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post<{ fotoUrl: string }>(`${this.apiUrl}/usuarios/upload-foto`, formData);
  }

  remove(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/usuarios/${id}`);
  }
}

