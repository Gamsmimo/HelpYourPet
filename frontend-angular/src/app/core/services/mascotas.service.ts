import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Mascota, CreateMascotaDto } from '../models/mascota.model';

@Injectable({
  providedIn: 'root'
})
export class MascotasService {
  private apiService = inject(ApiService);

  getMascotas(): Observable<Mascota[]> {
    return this.apiService.get<Mascota[]>('/mascotas');
  }

  getMisMascotas(): Observable<Mascota[]> {
    return this.apiService.get<Mascota[]>('/mascotas/mis-mascotas');
  }

  getMascotasByUsuario(usuarioId: number): Observable<Mascota[]> {
    return this.apiService.get<Mascota[]>(`/mascotas/usuario/${usuarioId}`);
  }

  getMascotaById(id: number): Observable<Mascota> {
    return this.apiService.get<Mascota>(`/mascotas/${id}`);
  }

  createMascota(data: CreateMascotaDto): Observable<Mascota> {
    return this.apiService.post<Mascota>('/mascotas', data);
  }

  updateMascota(id: number, data: Partial<CreateMascotaDto>): Observable<Mascota> {
    return this.apiService.patch<Mascota>(`/mascotas/${id}`, data);
  }

  deleteMascota(id: number): Observable<void> {
    return this.apiService.delete<void>(`/mascotas/${id}`);
  }
}
