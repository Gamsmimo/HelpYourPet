import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Cita, CreateCitaDto } from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private apiService = inject(ApiService);

  getCitas(): Observable<Cita[]> {
    return this.apiService.get<Cita[]>('/citas');
  }

  getMisCitas(): Observable<Cita[]> {
    return this.apiService.get<Cita[]>('/citas/mis-citas');
  }

  getCitaById(id: number): Observable<Cita> {
    return this.apiService.get<Cita>(`/citas/${id}`);
  }

  createCita(data: CreateCitaDto): Observable<Cita> {
    return this.apiService.post<Cita>('/citas', data);
  }

  updateCita(id: number, data: Partial<CreateCitaDto>): Observable<Cita> {
    return this.apiService.patch<Cita>(`/citas/${id}`, data);
  }

  deleteCita(id: number): Observable<void> {
    return this.apiService.delete<void>(`/citas/${id}`);
  }
}
