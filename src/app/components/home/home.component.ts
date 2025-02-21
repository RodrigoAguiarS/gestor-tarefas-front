import { Component, OnInit } from '@angular/core';
import { TarefaService } from '../../services/tarefa.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
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
        this.tarefasCount = {
          EM_ANDAMENTO: count.EM_ANDAMENTO,
          PENDENTE: count.PENDENTE,
          CONCLUIDA: count.CONCLUIDA
        };
      },
      error: (error) => {
        this.message.error(error.error.message);
      }
    });
  }

  private carregarUsuarioComMaisTarefasConcluidas(): void {
    this.tarefaService.getUsuarioComMaisTarefasConcluidas().subscribe({
      next: (data: UsuarioComTarefasConcluidas[]) => {
        this.usuarioComMaisTarefasConcluidas = data;
      },
      error: (error) => {
        this.message.error(error.error.message);
      }
    });
  }
}
