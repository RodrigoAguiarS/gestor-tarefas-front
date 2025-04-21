import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  conectar(usuarioId: number): Observable<string> {

    return new Observable((observer) => {

      let token = localStorage.getItem('token')

      console.log(`🔗 Tentando conectar ao SSE para o usuário com ID: ${usuarioId}`);

      const eventSource = new EventSource(
        `${API_CONFIG.baseUrl}/api/sse/conectar/${usuarioId}?token=${token}`
      );

      eventSource.addEventListener('nova-notificacao', (event: any) => {
        console.log('📩 Nova notificação recebida:', event.data);
        observer.next(event.data);
      });

      eventSource.onerror = (err) => {
        console.error('❌ Erro no SSE:', err);
        console.log('🔌 Fechando conexão SSE devido a erro.');
        eventSource.close();
        observer.error(err);
      };

      return () => {
        console.log('🔒 Fechando conexão SSE manualmente.');
        eventSource.close();
      };
    });
  }
}
