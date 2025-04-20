import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RxStomp } from '@stomp/rx-stomp';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private readonly rxStomp: RxStomp;

  constructor() {
    this.rxStomp = new RxStomp();
    this.conectar();
  }

  private conectar(): void {
    this.rxStomp.configure({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {},
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 5000
    });
    this.rxStomp.activate();
  }

  receberNotificacaoVendas(): Observable<any> {
    return this.rxStomp.watch('/topic/vendas');
  }

  desconectar(): void {
    this.rxStomp.deactivate();
  }
}
