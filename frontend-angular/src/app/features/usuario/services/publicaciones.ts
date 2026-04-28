import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  PublicacionApi,
  PublicacionComentarioApi,
  PublicacionReaccionApi,
} from '../models/publicaciones.model';

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

  createPublicacion(contenido: string, imagen?: string): Observable<PublicacionApi> {
    const data: { contenido: string; imagen?: string } = {
      contenido,
      ...(imagen && { imagen }),
    };
    console.log('Enviando publicación:', data);
    return this.withTimeout(this.http.post<PublicacionApi>(this.apiUrl, data));
  }

  getPublicacionesByUsuario(
    idUsuario: number,
  ): Observable<PublicacionApi[]> {
    return this.withTimeout(
      this.http
        .get<PublicacionApi[] | { data?: PublicacionApi[] }>(
          `${this.apiUrl}/usuario/${idUsuario}`,
        )
        .pipe(
          map((response) =>
            Array.isArray(response)
              ? response
              : Array.isArray(response?.data)
                ? response.data
                : [],
          ),
        ),
    );
  }

  getAllPublicaciones(): Observable<PublicacionApi[]> {
    return this.withTimeout(this.http.get<PublicacionApi[]>(this.apiUrl));
  }

  getPublicacionById(id: number): Observable<PublicacionApi> {
    return this.withTimeout(this.http.get<PublicacionApi>(`${this.apiUrl}/${id}`));
  }

  updatePublicacion(
    id: number,
    data: Partial<Pick<PublicacionApi, 'contenido' | 'imagen'>>,
  ): Observable<PublicacionApi> {
    return this.withTimeout(this.http.patch<PublicacionApi>(`${this.apiUrl}/${id}`, data));
  }

  deletePublicacion(id: number): Observable<void> {
    return this.withTimeout(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }

  incrementarLikes(id: number): Observable<any> {
    return this.withTimeout(this.http.post(`${this.apiUrl}/${id}/likes`, {}));
  }

  incrementarComentarios(id: number): Observable<any> {
    return this.withTimeout(this.http.post(`${this.apiUrl}/${id}/comentarios`, {}));
  }

  // ==================== COMENTARIOS ====================

  createComentario(
    idPublicacion: number,
    idUsuario: number,
    contenido: string,
  ): Observable<PublicacionComentarioApi> {
    return this.withTimeout(
      this.http.post<PublicacionComentarioApi>(`${this.apiUrl}/comentarios`, {
        idPublicacion,
        idUsuario,
        contenido,
      }),
    );
  }

  getComentarios(idPublicacion: number): Observable<PublicacionComentarioApi[]> {
    return this.withTimeout(
      this.http.get<PublicacionComentarioApi[]>(
        `${this.apiUrl}/${idPublicacion}/comentarios/list`,
      ),
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

  getReacciones(idPublicacion: number): Observable<PublicacionReaccionApi[]> {
    return this.withTimeout(
      this.http.get<PublicacionReaccionApi[]>(`${this.apiUrl}/${idPublicacion}/reacciones`),
    );
  }

  checkUserReaction(idPublicacion: number, idUsuario: number): Observable<boolean> {
    return this.withTimeout(
      this.http.get<boolean>(`${this.apiUrl}/${idPublicacion}/reacciones/check/${idUsuario}`),
    );
  }
}
