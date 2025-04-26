import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsuarioService } from '../../services/usuario.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UsuarioChangeService } from '../../services/usuario-change.service';
import { CommonModule } from '@angular/common';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { FormatarHorarioPipe } from '../../../pipe';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    FormatarHorarioPipe,
    NzPageHeaderModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    NzCollapseModule,
    NzInputModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  usuario: Usuario = new Usuario();
  papel: string[] = [];
  impersonateAtivo: boolean = true;
  mostrarDetalhes: boolean = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly usuarioService: UsuarioService,
    private readonly userChangeService: UsuarioChangeService
  ) {}

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
      complete: () => {},
    });
  }
}
