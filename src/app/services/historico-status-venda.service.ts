import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HistoricoStatusVenda } from '../model/HistoricoStatusVenda';
import { API_CONFIG } from '../config/api.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoricoStatusVendaService {

  constructor(private readonly http: HttpClient) {}

  getHistoricoStatus(vendaId: number): Observable<HistoricoStatusVenda[]> {
    return this.http.get<HistoricoStatusVenda[]>(`${API_CONFIG.baseUrl}/historico-venda/${vendaId}/historico-status`);
  }
}
