import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private readonly http: HttpClient) { }

  verificarStatusEmopresa(): Observable<boolean> {
    return this.http.get<boolean>(`${API_CONFIG.baseUrl}/empresas/esta-aberto`);
  }
}
