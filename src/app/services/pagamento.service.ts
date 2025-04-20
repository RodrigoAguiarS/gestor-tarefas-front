import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap, Observable, of, toArray } from 'rxjs';
import { Pagamento } from '../model/Pagamento';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class PagamentoService {
  constructor(private readonly http: HttpClient) {}

  carregaPaginado(page: number, size: number): Observable<Pagamento[]> {
    return this.http
      .get<{ content: Pagamento[] }>(
        `${API_CONFIG.baseUrl}/pagamentos?page=${page}&size=${size}&sort=nome`
      )
      .pipe(map((response) => response.content));
  }

  findAllPaginada(
    page: number,
    size: number
  ): Observable<{ content: Pagamento[]; totalElements: number }> {
    return this.http.get<{ content: Pagamento[]; totalElements: number }>(
      `${API_CONFIG.baseUrl}/pagamentos?page=${page}&size=${size}&sort=nome`
    );
  }

  findAll(): Observable<Pagamento[]> {
    const pageSize = 50;
    let currentPage = 0;
    let allPagamentos: Pagamento[] = [];

    return this.carregaPaginado(currentPage, pageSize).pipe(
      mergeMap((pagamentos) => {
        allPagamentos = allPagamentos.concat(pagamentos);
        if (pagamentos.length < pageSize) {
          return of(allPagamentos);
        } else {
          currentPage++;
          return this.carregaPaginado(currentPage, pageSize).pipe(
            mergeMap((nextPagamentos) => {
              allPagamentos = allPagamentos.concat(nextPagamentos);
              return of(allPagamentos);
            })
          );
        }
      }),
      toArray(),
      map((arrays: any[]) => arrays.flat())
    );
  }

  findById(id: any): Observable<Pagamento> {
    return this.http.get<Pagamento>(`${API_CONFIG.baseUrl}/pagamentos/${id}`);
  }

  create(pagamento: Pagamento): Observable<Pagamento> {
    return this.http.post<Pagamento>(
      `${API_CONFIG.baseUrl}/pagamentos`,
      pagamento
    );
  }

  update(pagamento: Pagamento): Observable<Pagamento> {
    return this.http.put<Pagamento>(
      `${API_CONFIG.baseUrl}/pagamentos/${pagamento.id}`,
      pagamento
    );
  }

  delete(id: any): Observable<Pagamento> {
    return this.http.delete<Pagamento>(
      `${API_CONFIG.baseUrl}/pagamentos/${id}`
    );
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    id?: string;
    nome?: string;
    porcentagemAcrescimo?: number;
    descricao?: string;
  }): Observable<{ content: Pagamento[]; totalElements: number }> {
    let url = `${API_CONFIG.baseUrl}/pagamentos?page=${params.page}&size=${params.size}`;

    if (params.id) {
      url += `&id=${params.id}`;
    }

    if (params.nome) {
      url += `&nome=${encodeURIComponent(params.nome)}`;
    }

    if (params.descricao) {
      url += `&descricao=${encodeURIComponent(params.descricao)}`;
    }

    if (params.porcentagemAcrescimo) {
      url += `&porcentagemAcrescimo=${params.porcentagemAcrescimo}`;
    }

    return this.http.get<{ content: Pagamento[]; totalElements: number }>(url);
  }
}
