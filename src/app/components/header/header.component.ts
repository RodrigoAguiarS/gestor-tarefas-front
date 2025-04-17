import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsuarioService } from '../../services/usuario.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { UsuarioChangeService } from '../../services/usuario-change.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSpaceModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  usuario: Usuario = new Usuario();
  papel: string[] = [];
  impersonateAtivo: boolean = true;

  constructor(
    private readonly message: NzMessageService,
    private readonly usuarioService: UsuarioService,
    private readonly userChangeService: UsuarioChangeService
  ) { }

  ngOnInit(): void {
    this.carregarUsuario();
    this.userChangeService.userChanged$.subscribe(() => {
      this.carregarUsuario();
    });
  }

 private carregarUsuario(): void {
    this.usuarioService.usuarioLogado().subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;
        this.papel = usuario.perfis.map((perfil) => perfil.nome);
      },
      error: (error) => {
        this.message.error(error.error.message);
      },
      complete: () => {
      }
    });
  }
}
