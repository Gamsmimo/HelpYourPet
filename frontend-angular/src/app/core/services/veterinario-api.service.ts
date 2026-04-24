import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  CreateEventoDto,
  CreateInventarioDto,
  CreateProductoDto,
  EventoVeterinaria,
  InventarioItem,
  PerfilVeterinario,
} from '../models/veterinario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VeterinarioApiService {
  private apiService = inject(ApiService);
  private http = inject(HttpClient);

  getPerfilByUsuario(idUsuario: number): Observable<PerfilVeterinario> {
    return this.apiService.get<PerfilVeterinario>(`/perfil-veterinario/usuario/${idUsuario}`);
  }

  updatePerfil(idPerfil: number, payload: Partial<PerfilVeterinario>): Observable<PerfilVeterinario> {
    return this.apiService.patch<PerfilVeterinario>(`/perfil-veterinario/${idPerfil}`, payload);
  }

  getEventosByVeterinaria(idVeterinaria: number): Observable<EventoVeterinaria[]> {
    return this.apiService.get<EventoVeterinaria[]>(`/eventos/veterinaria/${idVeterinaria}`);
  }

  createEvento(payload: CreateEventoDto): Observable<EventoVeterinaria> {
    return this.apiService.post<EventoVeterinaria>('/eventos', payload);
  }

  updateEvento(idEvento: number, payload: Partial<CreateEventoDto>): Observable<EventoVeterinaria> {
    return this.apiService.patch<EventoVeterinaria>(`/eventos/${idEvento}`, payload);
  }

  deleteEvento(idEvento: number): Observable<void> {
    return this.apiService.delete<void>(`/eventos/${idEvento}`);
  }

  getInventarioByVeterinaria(idVeterinaria: number): Observable<InventarioItem[]> {
    return this.apiService.get<InventarioItem[]>(`/inventario/veterinaria/${idVeterinaria}`);
  }

  createProducto(payload: CreateProductoDto): Observable<{ id: number }> {
    return this.apiService.post<{ id: number }>('/productos', payload);
  }

  updateProducto(idProducto: number, payload: Partial<CreateProductoDto>): Observable<{ id: number }> {
    return this.apiService.patch<{ id: number }>(`/productos/${idProducto}`, payload);
  }

  deleteProducto(idProducto: number): Observable<void> {
    return this.apiService.delete<void>(`/productos/${idProducto}`);
  }

  createInventario(payload: CreateInventarioDto): Observable<InventarioItem> {
    return this.apiService.post<InventarioItem>('/inventario', payload);
  }

  registerProduct(payload: any): Observable<InventarioItem> {
    return this.apiService.post<InventarioItem>('/inventario/register', payload);
  }

  updateInventario(idInventario: number, payload: Partial<CreateInventarioDto>): Observable<InventarioItem> {
    return this.apiService.patch<InventarioItem>(`/inventario/${idInventario}`, payload);
  }

  updateUsuario(idUsuario: number, payload: {
    nombres?: string;
    apellidos?: string;
    correo?: string;
    telefono?: string;
    direccion?: string;
    imagen?: string;
  }) {
    return this.apiService.patch(`/usuarios/${idUsuario}`, payload);
  }

  uploadFoto(file: File): Observable<{ fotoUrl: string }> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post<{ fotoUrl: string }>(`${environment.apiUrl}/usuarios/upload-foto`, formData);
  }
}
