import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../model/Usuario';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private readonly http: HttpClient) { }

  obterDadosUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(`${API_CONFIG.baseUrl}/usuarios/dados`);
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
    email?: string;
    perfilId?: number;
  }): Observable<{ content: Usuario[]; totalElements: number }> {

    let url = `${API_CONFIG.baseUrl}/usuarios/buscar?page=${params.page}&size=${params.size}`;

    if (params.sort) {
      url += `&sort=${params.sort}`;
    }

    if (params.nome) {
      url += `&nome=${encodeURIComponent(params.nome)}`;
    }

    if (params.cpf) {
      url += `&cpf=${encodeURIComponent(params.cpf)}`;
    }

    if (params.email) {
      url += `&email=${encodeURIComponent(params.email)}`;
    }

    if (params.perfilId) {
      url += `&perfilId=${params.perfilId}`;
    }

    return this.http.get<{ content: Usuario[]; totalElements: number }>(url);
  }

  create(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${API_CONFIG.baseUrl}/usuarios`, usuario);
  }

  findById(id: any): Observable<Usuario> {
    return this.http.get<Usuario>(`${API_CONFIG.baseUrl}/usuarios/${id}`);
  }

  update(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${API_CONFIG.baseUrl}/usuarios/${usuario.id}`, usuario);
  }

  delete(id: any): Observable<Usuario> {
    return this.http.delete<Usuario>(`${API_CONFIG.baseUrl}/usuarios/${id}`);
  }
}
