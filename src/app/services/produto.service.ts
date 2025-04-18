import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produto } from '../model/Produto';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  constructor(private readonly http: HttpClient) {}

  findById(id: any): Observable<Produto> {
    return this.http.get<Produto>(`${API_CONFIG.baseUrl}/produtos/${id}`);
  }

  create(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(`${API_CONFIG.baseUrl}/produtos`, produto);
  }

  update(produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(
      `${API_CONFIG.baseUrl}/produtos/${produto.id}`,
      produto
    );
  }

  delete(id: any): Observable<Produto> {
    return this.http.delete<Produto>(`${API_CONFIG.baseUrl}/produtos/${id}`);
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    id?: string;
    nome?: string;
    preco?: number;
    codigoBarras?: string;
    quantidade?: number;
    descricao?: string;
    categoriaId?: string;
  }): Observable<{ content: Produto[]; totalElements: number }> {
    let url = `${API_CONFIG.baseUrl}/produtos/buscar?page=${params.page}&size=${params.size}`;

    if (params.id) {
      url += `&id=${encodeURIComponent(params.id)}`;
    }

    if (params.nome) {
      url += `&nome=${encodeURIComponent(params.nome)}`;
    }

    if (params.descricao) {
      url += `&descricao=${encodeURIComponent(params.descricao)}`;
    }

    if (params.preco) {
      url += `&preco=${encodeURIComponent(params.preco)}`;
    }

    if (params.codigoBarras) {
      url += `&codigoBarras=${encodeURIComponent(params.codigoBarras)}`;
    }

    if (params.quantidade) {
      url += `&quantidade=${encodeURIComponent(params.quantidade)}`;
    }

    if (params.categoriaId) {
      url += `&categoriaId=${encodeURIComponent(params.categoriaId)}`;
    }

    return this.http.get<{ content: Produto[]; totalElements: number }>(url);
  }
}
