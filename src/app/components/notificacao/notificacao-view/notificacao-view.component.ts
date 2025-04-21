import { Component, OnDestroy, OnInit } from '@angular/core';
import { SseService } from '../../../services/sse.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../model/Usuario';
import { UsuarioChangeService } from '../../../services/usuario-change.service';

@Component({
  selector: 'app-notificacao-view',
  templateUrl: './notificacao-view.component.html',
  styleUrls: ['./notificacao-view.component.css']
})
export class NotificacaoViewComponent implements OnInit, OnDestroy {
  private sseSubscription!: Subscription;
  usuario!: Usuario;

  constructor(
    private readonly sseService: SseService,
    private readonly usuarioService: UsuarioService,
    private readonly message: NzMessageService,
    private readonly usuarioChangeService: UsuarioChangeService,
    private readonly notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.usuarioService.usuarioLogado().subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;

        if (!usuario.id) {
          this.message.error('ID do usuário não encontrado.');
        }

        this.sseSubscription = this.sseService.conectar(usuario.id).subscribe({
          next: (mensagem) => {
            this.notification.success('Nova Tarefa', mensagem);
            this.usuarioChangeService.notifyUserChanged();
          },
          error: (err) => {
            this.notification.error(
              'Erro de Notificação',
              'Não foi possível receber notificações.'
            );
          }
        });
      },
      error: (err) => {
        this.notification.error(
          'Erro ao Carregar Usuário',
          'Não foi possível carregar os dados do usuário.'
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
    }
  }
}
