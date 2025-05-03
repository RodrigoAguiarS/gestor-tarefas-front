import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../model/Usuario';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Funcionario } from '../model/Funcionario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private readonly http: HttpClient) { }

  usuarioLogado(): Observable<Usuario> {
    return this.http.get<Usuario>(`${API_CONFIG.baseUrl}/usuarios/logado`);
  }

  findAll(page: number, size: number, sort: string): Observable<{ content: Usuario[], totalElements: number }> {
    return this.http.get<{ content: Usuario[], totalElements: number }>(`${API_CONFIG.baseUrl}/usuarios?page=${page}&size=${size}&sort=${sort}`);
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    sort?: string;
    nome?: string;
    cpf?: string;
    cargo?: string;
    matricula?: number;
    email?: string;
    perfilId?: number;

  }): Observable<{ content: Funcionario[]; totalElements: number }> {

    let url = `${API_CONFIG.baseUrl}/funcionarios/buscar?page=${params.page}&size=${params.size}`;

    if (params.sort) {
      url += `&sort=${params.sort}`;
    }

    if (params.nome) {
      url += `&nome=${encodeURIComponent(params.nome)}`;
    }

    if (params.cpf) {
      url += `&cpf=${encodeURIComponent(params.cpf)}`;
    }

    if (params.cargo) {
      url += `&cargo=${encodeURIComponent(params.cargo)}`;
    }

    if (params.matricula) {
      url += `&matricula=${encodeURIComponent(params.matricula)}`;
    }

    if (params.email) {
      url += `&email=${encodeURIComponent(params.email)}`;
    }

    if (params.perfilId) {
      url += `&perfilId=${params.perfilId}`;
    }

    return this.http.get<{ content: Funcionario[]; totalElements: number }>(url);
  }

  create(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(`${API_CONFIG.baseUrl}/funcionarios`, funcionario);
  }

  findById(id: any): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${API_CONFIG.baseUrl}/funcionarios/${id}`);
  }

  update(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${API_CONFIG.baseUrl}/funcionarios/${funcionario.id}`, funcionario);
  }

  delete(id: any): Observable<Funcionario> {
    return this.http.delete<Funcionario>(`${API_CONFIG.baseUrl}/funcionarios/${id}`);
  }
}
