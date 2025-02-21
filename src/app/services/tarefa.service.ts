import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa } from '../model/Tarefa';
import { API_CONFIG } from '../config/api.config';
import { UsuarioComTarefasConcluidas } from '../model/UsuarioComTarefasConcluidas';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  constructor(private readonly http: HttpClient) { }

  findById(id: any): Observable<Tarefa> {
    return this.http.get<Tarefa>(`${API_CONFIG.baseUrl}/tarefas/${id}`);
  }

  create(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.post<Tarefa>(`${API_CONFIG.baseUrl}/tarefas`, tarefa);
  }

  findByUsuarioId(id: number): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${API_CONFIG.baseUrl}/tarefas/responsavel/${id}/tarefas`);
  }

  update(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${API_CONFIG.baseUrl}/tarefas/${tarefa.id}`, tarefa);
  }

  concluirTarefa(id: number): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${API_CONFIG.baseUrl}/tarefas/${id}/concluir`, {});
  }

  andamentoTarefa(id: number): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${API_CONFIG.baseUrl}/tarefas/${id}/andamento`, {});
  }

  delete(id: any): Observable<Tarefa> {
    return this.http.delete<Tarefa>(`${API_CONFIG.baseUrl}/tarefas/${id}`);
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    id?: string;
    titulo?: string;
    descricao?: string;
    prioridade?: string;
    responsavelId?: string;
    situacao?: string;
  }): Observable<{ content: Tarefa[], totalElements: number }> {
    let url = `${API_CONFIG.baseUrl}/tarefas/buscar?page=${params.page}&size=${params.size}`;

    if (params.id) {
      url += `&id=${params.id}`;
    }

    if (params.titulo) {
      url += `&titulo=${encodeURIComponent(params.titulo)}`;
    }

    if (params.descricao) {
      url += `&descricao=${encodeURIComponent(params.descricao)}`;
    }

    if (params.responsavelId) {
      url += `&responsavelId=${params.responsavelId}`;
    }

    if (params.prioridade) {
      url += `&prioridade=${params.prioridade}`;
    }

    if (params.situacao) {
      url += `&situacao=${params.situacao}`;
    }

    return this.http.get<{ content: Tarefa[], totalElements: number }>(url);
  }

  getTarefasCountBySituacao(): Observable<{ EM_ANDAMENTO: number, PENDENTE: number, CONCLUIDA: number }> {
    return this.http.get<{ EM_ANDAMENTO: number, PENDENTE: number, CONCLUIDA: number }>(`${API_CONFIG.baseUrl}/tarefas/contagem-por-situacao`);
  }

  getUsuarioComMaisTarefasConcluidas(): Observable<UsuarioComTarefasConcluidas[]> {
    return this.http.get<UsuarioComTarefasConcluidas[]>(`${API_CONFIG.baseUrl}/tarefas/responsavel/tarefas-concluidas`);
  }
}
