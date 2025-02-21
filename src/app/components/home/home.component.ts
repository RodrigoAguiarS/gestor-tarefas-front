import { Component, OnInit } from '@angular/core';
import { TarefaService } from '../../services/tarefa.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../model/Usuario';
import { UsuarioComTarefasConcluidas } from '../../model/UsuarioComTarefasConcluidas';
@Component({
  selector: 'app-home',
    imports: [
      CommonModule,
    ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tarefasCount: { EM_ANDAMENTO: number, PENDENTE: number, CONCLUIDA: number } = { EM_ANDAMENTO: 0, PENDENTE: 0, CONCLUIDA: 0 };
  usuarioComMaisTarefasConcluidas: UsuarioComTarefasConcluidas[] = [];

  constructor(
    private readonly tarefaService: TarefaService,
    private readonly message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.carregarTarefasCount();
    this.carregarUsuarioComMaisTarefasConcluidas();
  }

  private carregarTarefasCount(): void {
    this.tarefaService.getTarefasCountBySituacao().subscribe({
      next: (count) => {
        console.log('Contagem de tarefas:', count);
        this.tarefasCount = {
          EM_ANDAMENTO: count.EM_ANDAMENTO,
          PENDENTE: count.PENDENTE,
          CONCLUIDA: count.CONCLUIDA
        };
        console.log('Tarefas count:', this.tarefasCount);
      },
      error: (error) => {
        console.error('Erro ao carregar contagem de tarefas:', error);
        this.message.error(error.error.message);
      }
    });
  }

  private carregarUsuarioComMaisTarefasConcluidas(): void {
    this.tarefaService.getUsuarioComMaisTarefasConcluidas().subscribe({
      next: (data: UsuarioComTarefasConcluidas[]) => {
        console.log('Usuário com mais tarefas concluídas:', data);
        this.usuarioComMaisTarefasConcluidas = data;
      },
      error: (error) => {
        console.error('Erro ao carregar usuário com mais tarefas concluídas:', error);
        this.message.error(error.error.message);
      }
    });
  }
}
