import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notificacao } from '../model/Notificacao';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {

  constructor(private readonly http: HttpClient) { }

  getNotificacoesNaoLidas(page: number, size: number): Observable<{ content: Notificacao[], totalElements: number }> {
      return this.http.get<{ content: Notificacao[], totalElements: number }>(`${API_CONFIG.baseUrl}/notificacao/nao-lidas?page=${page}&size=${size}&sort=criadaEm,desc`);
    }

  marcarComoLida(id: number): Observable<void> {
    return this.http.put<void>(`${API_CONFIG.baseUrl}/notificacao/${id}/marcar-como-lida`, {});
  }
}
