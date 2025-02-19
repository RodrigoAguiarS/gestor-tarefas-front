import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap, Observable, of, toArray } from 'rxjs';
import { Perfil } from '../model/Perfil';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(private readonly http: HttpClient) { }

  carregaPaginado(page: number, size: number): Observable<Perfil[]> {
    return this.http.get<{ content: Perfil[] }>(`${API_CONFIG.baseUrl}/perfis?page=${page}&size=${size}&sort=nome,asc`)
      .pipe(map(response => response.content));
  }

  findAllPaginada(page: number, size: number): Observable<{ content: Perfil[], totalElements: number }> {
    return this.http.get<{ content: Perfil[], totalElements: number }>(`${API_CONFIG.baseUrl}/perfis?page=${page}&size=${size}&sort=nome,asc`);
  }

  findAll(): Observable<Perfil[]> {
    const pageSize = 50;
    let currentPage = 0;
    let allPerfis: Perfil[] = [];

    return this.carregaPaginado(currentPage, pageSize).pipe(
      mergeMap(perfis => {
        allPerfis = allPerfis.concat(perfis);
        if (perfis.length < pageSize) {
          return of(allPerfis);
        } else {
          currentPage++;
          return this.carregaPaginado(currentPage, pageSize).pipe(
            mergeMap(nextPerfis => {
              allPerfis = allPerfis.concat(nextPerfis);
              return of(allPerfis);
            })
          );
        }
      }),
      toArray(),
      map((arrays: any[]) => arrays.flat())
    );
  }

  findById(id: any): Observable<Perfil> {
    return this.http.get<Perfil>(`${API_CONFIG.baseUrl}/perfis/${id}`);
  }

  create(perfil: Perfil): Observable<Perfil> {
    return this.http.post<Perfil>(`${API_CONFIG.baseUrl}/perfis`, perfil);
  }

  update(perfil: Perfil): Observable<Perfil> {
    return this.http.put<Perfil>(`${API_CONFIG.baseUrl}/perfis/${perfil.id}`, perfil);
  }

  delete(id: any): Observable<Perfil> {
    return this.http.delete<Perfil>(`${API_CONFIG.baseUrl}/perfis/${id}`);
  }
}
