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
      idUsuario: Number(idUsuario),
      contenido,
      ...(imagen && { imagen })
    };
    console.log('Enviando publicación:', data);
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

  // ==================== COMENTARIOS ====================

  createComentario(idPublicacion: number, idUsuario: number, contenido: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/comentarios`, {
      idPublicacion,
      idUsuario,
      contenido
    });
  }

  getComentarios(idPublicacion: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idPublicacion}/comentarios/list`);
  }

  deleteComentario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comentarios/${id}`);
  }

  // ==================== REACCIONES (LIKES) ====================

  toggleReaccion(idPublicacion: number, idUsuario: number): Observable<{ liked: boolean; totalLikes: number }> {
    return this.http.post<{ liked: boolean; totalLikes: number }>(`${this.apiUrl}/reacciones`, {
      idPublicacion,
      idUsuario
    });
  }

  getReacciones(idPublicacion: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idPublicacion}/reacciones`);
  }

  checkUserReaction(idPublicacion: number, idUsuario: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${idPublicacion}/reacciones/check/${idUsuario}`);
  }
}
