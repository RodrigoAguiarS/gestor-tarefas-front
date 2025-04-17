import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap, Observable, of, toArray } from 'rxjs';
import { Categoria } from '../model/Categoria';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private readonly http: HttpClient) { }

  carregaPaginado(page: number, size: number): Observable<Categoria[]> {
    return this.http.get<{ content: Categoria[] }>(`${API_CONFIG.baseUrl}/categorias?page=${page}&size=${size}&sort=nome,asc`)
      .pipe(map(response => response.content));
  }

  findAllPaginada(page: number, size: number): Observable<{ content: Categoria[], totalElements: number }> {
    return this.http.get<{ content: Categoria[], totalElements: number }>(`${API_CONFIG.baseUrl}/categorias?page=${page}&size=${size}&sort=nome,asc`);
  }

  findAll(): Observable<Categoria[]> {
    const pageSize = 50;
    let currentPage = 0;
    let allCategorias: Categoria[] = [];

    return this.carregaPaginado(currentPage, pageSize).pipe(
      mergeMap(categorias => {
        allCategorias = allCategorias.concat(categorias);
        if (categorias.length < pageSize) {
          return of(allCategorias);
        } else {
          currentPage++;
          return this.carregaPaginado(currentPage, pageSize).pipe(
            mergeMap(nextCategorias => {
              allCategorias = allCategorias.concat(nextCategorias);
              return of(allCategorias);
            })
          );
        }
      }),
      toArray(),
      map((arrays: any[]) => arrays.flat())
    );
  }

  findById(id: any): Observable<Categoria> {
    return this.http.get<Categoria>(`${API_CONFIG.baseUrl}/categorias/${id}`);
  }

  create(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${API_CONFIG.baseUrl}/categorias`, categoria);
  }

  update(categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${API_CONFIG.baseUrl}/categorias/${categoria.id}`, categoria);
  }

  delete(id: any): Observable<Categoria> {
    return this.http.delete<Categoria>(`${API_CONFIG.baseUrl}/categorias/${id}`);
  }
}
