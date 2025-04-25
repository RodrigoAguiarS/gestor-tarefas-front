import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../model/Cliente';
import { API_CONFIG } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { ClienteRetorno } from '../model/ClienteRetorno';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private readonly http: HttpClient) {}

  findById(id: any): Observable<Cliente> {
    return this.http.get<Cliente>(`${API_CONFIG.baseUrl}/clientes/${id}`);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${API_CONFIG.baseUrl}/clientes`, cliente);
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${API_CONFIG.baseUrl}/clientes/${cliente.id}`,
      cliente
    );
  }

  delete(id: any): Observable<Cliente> {
    return this.http.delete<Cliente>(`${API_CONFIG.baseUrl}/clientes/${id}`);
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    id?: string;
    nome?: string;
    cpf?: string;
    cidade?: string;
    estado?: number;
    cep?: string;
  }): Observable<{ content: Cliente[]; totalElements: number }> {
    let url = `${API_CONFIG.baseUrl}/clientes/buscar?page=${params.page}&size=${params.size}`;

    if (params.id) {
      url += `&id=${encodeURIComponent(params.id)}`;
    }

    if (params.nome) {
      url += `&nome=${encodeURIComponent(params.nome)}`;
    }

    if (params.cpf) {
      url += `&cpf=${encodeURIComponent(params.cpf)}`;
    }

    if (params.cidade) {
      url += `&cidade=${encodeURIComponent(params.cidade)}`;
    }

    if (params.estado) {
      url += `&estado=${encodeURIComponent(params.estado)}`;
    }

    if (params.cep) {
      url += `&cep=${encodeURIComponent(params.cep)}`;
    }

    return this.http.get<{ content: Cliente[]; totalElements: number }>(url);
  }

  usuarioLogado(): Observable<ClienteRetorno> {
    return this.http.get<ClienteRetorno>(`${API_CONFIG.baseUrl}/clientes/logado`);
  }
}
