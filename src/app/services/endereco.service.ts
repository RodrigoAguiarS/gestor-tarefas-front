import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnderecoResposta } from '../model/EnderecoReponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  constructor(private readonly http: HttpClient) {}

  buscaEnderecoPorCep(cep: string): Observable<EnderecoResposta> {
    return this.http.get<EnderecoResposta>(
      `https://viacep.com.br/ws/${cep}/json/`
    );
  }
}
