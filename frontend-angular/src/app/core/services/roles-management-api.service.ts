import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RolesManagementApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createVeterinario(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/roles-management/create-veterinario`, payload);
  }
}

