import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ACESSO } from '../../model/Acesso';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioChangeService } from '../../services/usuario-change.service';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NotificacaoService } from '../../services/notificacao.service';
@Component({
  selector: 'app-nav',
  imports: [
    NzLayoutModule,
    CommonModule,
    RouterModule,
    NzIconModule,
    NzMenuModule,
    HeaderComponent,
    NzBadgeModule,
  ],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  ACESSO = ACESSO;
  isCollapsed = false;
  roles: string[] = [];
  usuario: Usuario = new Usuario();
  quantidadeNotificacoes = 0;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
    private readonly message: NzMessageService,
    private readonly usuarioChange: UsuarioChangeService,
    private readonly notificationService: NotificacaoService
  ) {}

  ngOnInit(): void {
    this.carregarUsuario();
    this.buscarNotificacoes();
    this.usuarioChange.userChanged$.subscribe(() => {
      this.carregarUsuario();
      this.buscarNotificacoes();
    });
  }

  private carregarUsuario(): void {
    this.usuarioService.usuarioLogado().subscribe({
      next: (usuario: Usuario | null) => {
        if (usuario) {
          this.usuario = usuario;
          this.roles = usuario.perfis.map((perfil) => perfil.nome);
        }
      },
      error: (error) => {
        this.message.error(error.error.message);
      },
    });
  }

  deslogar(): void {
    this.authService.logout();
    this.router.navigate(['login']);
    this.message.info('Usuário deslogado com sucesso');
  }

  onCollapse(collapsed: boolean): void {
    requestAnimationFrame(() => {
      this.isCollapsed = collapsed;
    });
  }

  buscarNotificacoes(): void {
    const page = 0;
    const size = 10;
    this.notificationService.getNotificacoesNaoLidas(page, size).subscribe({
      next: (response) => {
        this.quantidadeNotificacoes = response.totalElements;
      },
      error: (err) => {
        this.message.error(err.error.message);
      }
    });
  }
}
