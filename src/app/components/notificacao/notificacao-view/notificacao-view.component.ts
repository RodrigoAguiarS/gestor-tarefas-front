import { Component } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service';
import { Subscription } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-notificacao-view',
  imports: [],
  templateUrl: './notificacao-view.component.html',
  styleUrl: './notificacao-view.component.css'
})
export class NotificacaoViewComponent {

  private subscription!: Subscription;

  constructor(
    private readonly websocketService: WebsocketService,
    private readonly notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.subscription = this.websocketService
      .receberNotificacaoVendas()
      .subscribe(message => {
        const venda = JSON.parse(message.body);
        this.mostrarNotificacao(venda);
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.websocketService.desconectar();
  }

  private mostrarNotificacao(venda: any) {
    this.notification.success(
      'Nova Venda Realizada',
      `Venda #${venda.id} - Valor: R$ ${venda.valorTotal}`,
      { nzDuration: 5000 }
    );
  }
}
