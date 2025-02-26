import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../model/Usuario';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioStateService {
  private readonly usuarioSubject = new BehaviorSubject<Usuario | null>(null);

  constructor(private readonly usuarioService: UsuarioService) {
    this.carregarUsuario();
  }

  private carregarUsuario(): void {
    this.usuarioService.usuarioLogado().subscribe({
      next: (usuario: Usuario) => {
        this.usuarioSubject.next(usuario);
      },
      error: (error) => {
        console.error('Erro ao carregar usuário:', error);
      },
    });
  }

  getUsuario(): Observable<Usuario | null> {
    return this.usuarioSubject.asObservable();
  }
}
