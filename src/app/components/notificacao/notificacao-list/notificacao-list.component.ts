import { Component, OnInit } from '@angular/core';
import { Notificacao } from '../../../model/Notificacao';
import { NotificacaoService } from '../../../services/notificacao.service';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LocalDateTimePipe } from "../../../../pipe";
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsuarioChangeService } from '../../../services/usuario-change.service';

@Component({
  selector: 'app-notificacao-list',
  imports: [
    NzListModule,
    CommonModule,
    NzSpinModule,
    NzCardModule,
    NzButtonModule,
    NzEmptyModule,
    NzDescriptionsModule,
    NzPaginationModule,
    NzPopconfirmModule,
    LocalDateTimePipe
  ],
  templateUrl: './notificacao-list.component.html',
  styleUrls: ['./notificacao-list.component.css']
})
export class NotificacaoListComponent implements OnInit {
  notificacoes: Notificacao[] = [];
  carregando = false;
  totalElementos = 0;
  itensPorPagina = 5;
  paginaAtual = 1;

  constructor(private readonly notificacaoService: NotificacaoService,
    private readonly message: NzMessageService,
  private readonly usuarioChangeService: UsuarioChangeService)
   {}

  ngOnInit(): void {
    this.buscarNotificacoes();
  }

  buscarNotificacoes(): void {
    this.carregando = true;
    this.notificacaoService.getNotificacoesNaoLidas(this.paginaAtual - 1, this.itensPorPagina).subscribe({
      next: (response) => {
        this.notificacoes = response.content;
        this.totalElementos = response.totalElements;
      },
      error: (error) => {
        this.message.error(error.error.message);
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      }
    });
  }

  marcarComoLida(id: number): void {
    this.carregando = true;
    this.notificacaoService.marcarComoLida(id).subscribe({
      next: () => {
        this.notificacoes = this.notificacoes.filter(n => n.id !== id);
        this.totalElementos--;
      },
      error: (error) => {
        this.carregando = false;
        this.message.error(error.error.message);
      },
      complete: () => {
        this.carregando = false;
        this.message.success('Notificação marcada como lida.');
        this.buscarNotificacoes();
        this.usuarioChangeService.notifyUserChanged();
      }
    });
  }

  aoMudarPagina(pagina: number): void {
    this.paginaAtual = pagina;
    this.buscarNotificacoes();
  }
}
