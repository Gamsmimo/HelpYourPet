import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private apiUrl = `${environment.apiUrl}/publicaciones`;

  constructor(private http: HttpClient) {}

  createPublicacion(idUsuario: number, contenido: string, imagen?: string): Observable<any> {
    const data: any = {
      idUsuario,
      contenido,
      ...(imagen && { imagen })
    };
    return this.http.post(this.apiUrl, data);
  }

  getPublicacionesByUsuario(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  getAllPublicaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPublicacionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updatePublicacion(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  deletePublicacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  incrementarLikes(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/likes`, {});
  }

  incrementarComentarios(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/comentarios`, {});
  }
}
