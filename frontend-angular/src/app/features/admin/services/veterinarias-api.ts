import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VeterinariasApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/veterinarias`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/veterinarias/${id}`);
  }

  /** Sube una imagen al backend. Devuelve { fotoUrl: string }. */
  uploadFoto(file: File): Observable<{ fotoUrl: string }> {
    const formData = new FormData();
    formData.append('foto', file, file.name);
    return this.http.post<{ fotoUrl: string }>(`${this.apiUrl}/veterinarias/upload-foto`, formData);
  }

  create(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/veterinarias`, payload);
  }

  update(id: number, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/veterinarias/${id}`, payload);
  }

  remove(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/veterinarias/${id}`);
  }
}

