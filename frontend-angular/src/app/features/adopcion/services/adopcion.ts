import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdopcionService {
  private apiUrl = `${environment.apiUrl}/adopcion`;

  constructor(private http: HttpClient) {}

  getAdopcionesByUsuario(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  getAdopcionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getAllAdopciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createAdopcion(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateAdopcion(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  deleteAdopcion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
