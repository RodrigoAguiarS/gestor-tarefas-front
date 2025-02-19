import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  usuario: Usuario = new Usuario();
  papel: string[] = [];

  constructor(
    private readonly message: NzMessageService,
    private readonly usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.carregarUsuario();
  }

  private carregarUsuario(): void {
    this.usuarioService.obterDadosUsuario().subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;
        this.papel = usuario.perfis.map((perfil) => perfil.nome);
      },
      error: (error) => {
        this.message.error(error.error.message);
      },
    });
  }
}
