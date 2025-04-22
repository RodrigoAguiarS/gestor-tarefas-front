import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscaService {
  private readonly termoDeBuscaSubject = new BehaviorSubject<string>('');
  private readonly categoriaSelecionadaSubject = new BehaviorSubject<string>('');

  termoDeBusca$ = this.termoDeBuscaSubject.asObservable();
  categoriaSelecionada$ = this.categoriaSelecionadaSubject.asObservable();

  atualizarTermoDeBusca(termo: string): void {
    this.termoDeBuscaSubject.next(termo);
  }

  atualizarCategoriaSelecionada(categoria: string): void {
    this.categoriaSelecionadaSubject.next(categoria);
  }
}
