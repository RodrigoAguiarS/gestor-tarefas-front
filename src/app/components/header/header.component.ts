import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsuarioStateService } from '../../services/usuario-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  usuario: Usuario = new Usuario();
  papel: string[] = [];

  constructor(
    private readonly message: NzMessageService,
    private readonly usuarioStateService: UsuarioStateService
  ) { }

  ngOnInit(): void {
    this.usuarioStateService.getUsuario().subscribe({
      next: (usuario: Usuario | null) => {
        if (usuario) {
          this.usuario = usuario;
          this.papel = usuario.perfis.map((perfil) => perfil.nome);
        }
      },
      error: (error) => {
        this.message.error(error.error.message);
      },
    });
  }
}
