import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa } from '../model/Tarefa';
import { API_CONFIG } from '../config/api.config';

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

  update(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${API_CONFIG.baseUrl}/tarefas/${tarefa.id}`, tarefa);
  }

  delete(id: any): Observable<Tarefa> {
    return this.http.delete<Tarefa>(`${API_CONFIG.baseUrl}/tarefas/${id}`);
  }
}
