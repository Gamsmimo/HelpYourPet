import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private apiUrl = `${environment.apiUrl}/publicaciones`;
  private readonly requestTimeoutMs = 15000;

  constructor(private http: HttpClient) {}

  private withTimeout<T>(request$: Observable<T>): Observable<T> {
    return request$.pipe(
      timeout(this.requestTimeoutMs),
      catchError((error: any) => {
        if (error?.name === 'TimeoutError') {
          return throwError(
            () =>
              new HttpErrorResponse({
                status: 0,
                statusText: 'Request Timeout',
                error: {
                  message:
                    'La solicitud tardó demasiado en responder. Intenta de nuevo.',
                },
              }),
          );
        }
        return throwError(() => error);
      }),
    );
  }

  createPublicacion(idUsuario: number, contenido: string, imagen?: string): Observable<any> {
    const data: any = {
      idUsuario: Number(idUsuario),
      contenido,
      ...(imagen && { imagen })
    };
    console.log('Enviando publicación:', data);
    return this.withTimeout(this.http.post(this.apiUrl, data));
  }

  getPublicacionesByUsuario(idUsuario: number): Observable<any[]> {
    return this.withTimeout(this.http.get<any[]>(`${this.apiUrl}/usuario/${idUsuario}`));
  }

  getAllPublicaciones(): Observable<any[]> {
    return this.withTimeout(this.http.get<any[]>(this.apiUrl));
  }

  getPublicacionById(id: number): Observable<any> {
    return this.withTimeout(this.http.get<any>(`${this.apiUrl}/${id}`));
  }

  updatePublicacion(id: number, data: any): Observable<any> {
    return this.withTimeout(this.http.patch(`${this.apiUrl}/${id}`, data));
  }

  deletePublicacion(id: number): Observable<any> {
    return this.withTimeout(this.http.delete(`${this.apiUrl}/${id}`));
  }

  incrementarLikes(id: number): Observable<any> {
    return this.withTimeout(this.http.post(`${this.apiUrl}/${id}/likes`, {}));
  }

  incrementarComentarios(id: number): Observable<any> {
    return this.withTimeout(this.http.post(`${this.apiUrl}/${id}/comentarios`, {}));
  }

  // ==================== COMENTARIOS ====================

  createComentario(idPublicacion: number, idUsuario: number, contenido: string): Observable<any> {
    return this.withTimeout(
      this.http.post(`${this.apiUrl}/comentarios`, {
        idPublicacion,
        idUsuario,
        contenido
      }),
    );
  }

  getComentarios(idPublicacion: number): Observable<any[]> {
    return this.withTimeout(
      this.http.get<any[]>(`${this.apiUrl}/${idPublicacion}/comentarios/list`),
    );
  }

  deleteComentario(id: number): Observable<any> {
    return this.withTimeout(this.http.delete(`${this.apiUrl}/comentarios/${id}`));
  }

  // ==================== REACCIONES (LIKES) ====================

  toggleReaccion(idPublicacion: number, idUsuario: number): Observable<{ liked: boolean; totalLikes: number }> {
    return this.withTimeout(
      this.http.post<{ liked: boolean; totalLikes: number }>(`${this.apiUrl}/reacciones`, {
        idPublicacion,
        idUsuario
      }),
    );
  }

  getReacciones(idPublicacion: number): Observable<any[]> {
    return this.withTimeout(this.http.get<any[]>(`${this.apiUrl}/${idPublicacion}/reacciones`));
  }

  checkUserReaction(idPublicacion: number, idUsuario: number): Observable<boolean> {
    return this.withTimeout(
      this.http.get<boolean>(`${this.apiUrl}/${idPublicacion}/reacciones/check/${idUsuario}`),
    );
  }
}
