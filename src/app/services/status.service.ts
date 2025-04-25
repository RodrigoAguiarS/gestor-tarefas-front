import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Status } from '../model/Status';
import { map, mergeMap, Observable, of, toArray } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private readonly http: HttpClient) {}

    carregaPaginado(page: number, size: number): Observable<Status[]> {
      return this.http
        .get<{ content: Status[] }>(
          `${API_CONFIG.baseUrl}/status?page=${page}&size=${size}&sort=nome`
        )
        .pipe(map((response) => response.content));
    }

    findAllPaginada(
      page: number,
      size: number
    ): Observable<{ content: Status[]; totalElements: number }> {
      return this.http.get<{ content: Status[]; totalElements: number }>(
        `${API_CONFIG.baseUrl}/status?page=${page}&size=${size}&sort=nome`
      );
    }

    findAll(): Observable<Status[]> {
      const pageSize = 50;
      let currentPage = 0;
      let allStatuss: Status[] = [];

      return this.carregaPaginado(currentPage, pageSize).pipe(
        mergeMap((status) => {
          allStatuss = allStatuss.concat(status);
          if (status.length < pageSize) {
            return of(allStatuss);
          } else {
            currentPage++;
            return this.carregaPaginado(currentPage, pageSize).pipe(
              mergeMap((nextStatuss) => {
                allStatuss = allStatuss.concat(nextStatuss);
                return of(allStatuss);
              })
            );
          }
        }),
        toArray(),
        map((arrays: any[]) => arrays.flat())
      );
    }

    findById(id: any): Observable<Status> {
      return this.http.get<Status>(`${API_CONFIG.baseUrl}/status/${id}`);
    }

    create(status: Status): Observable<Status> {
      return this.http.post<Status>(
        `${API_CONFIG.baseUrl}/status`,
        status
      );
    }

    update(status: Status): Observable<Status> {
      return this.http.put<Status>(
        `${API_CONFIG.baseUrl}/status/${status.id}`,
        status
      );
    }

    delete(id: any): Observable<Status> {
      return this.http.delete<Status>(
        `${API_CONFIG.baseUrl}/status/${id}`
      );
    }

    buscarPaginado(params: {
      page: number;
      size: number;
      id?: string;
      nome?: string;
      descricao?: string;
    }): Observable<{ content: Status[]; totalElements: number }> {
      let url = `${API_CONFIG.baseUrl}/status?page=${params.page}&size=${params.size}`;

      if (params.id) {
        url += `&id=${params.id}`;
      }

      if (params.nome) {
        url += `&nome=${encodeURIComponent(params.nome)}`;
      }

      if (params.descricao) {
        url += `&descricao=${encodeURIComponent(params.descricao)}`;
      }

      return this.http.get<{ content: Status[]; totalElements: number }>(url);
    }

    getProximosStatus(id: number, tipoVenda: string): Observable<Status[]> {
      return this.http.get<Status[]>(
        `${API_CONFIG.baseUrl}/status/${id}/proximos-status?tipoVenda=${tipoVenda}`
      );
    }
  }
