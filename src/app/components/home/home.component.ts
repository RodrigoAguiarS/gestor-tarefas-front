import { Component, OnInit } from '@angular/core';
import { TarefaService } from '../../services/tarefa.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { UsuarioComTarefasConcluidas } from '../../model/UsuarioComTarefasConcluidas';
import { NzSpinModule } from 'ng-zorro-antd/spin';
@Component({
  selector: 'app-home',
    imports: [
      CommonModule,
      NzSpinModule,
    ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tarefasCount: { EM_ANDAMENTO: number, PENDENTE: number, CONCLUIDA: number } = { EM_ANDAMENTO: 0, PENDENTE: 0, CONCLUIDA: 0 };
  usuarioComMaisTarefasConcluidas: UsuarioComTarefasConcluidas[] = [];
  carregando = true;
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
          EM_ANDAMENTO: count.EM_ANDAMENTO || 0,
          PENDENTE: count.PENDENTE || 0,
          CONCLUIDA: count.CONCLUIDA || 0
        };
        this.checkCarregando();
      },
      error: (error) => {
        this.message.error(error.error.message);
        this.checkCarregando();
      }
    });
  }

  private carregarUsuarioComMaisTarefasConcluidas(): void {
    this.tarefaService.getUsuarioComMaisTarefasConcluidas().subscribe({
      next: (data: UsuarioComTarefasConcluidas[]) => {
        this.usuarioComMaisTarefasConcluidas = data;
        this.checkCarregando();
      },
      error: (error) => {
        this.message.error(error.error.message);
        this.checkCarregando();
      }
    });
  }

  private checkCarregando(): void {
    if (this.tarefasCount && this.usuarioComMaisTarefasConcluidas) {
      this.carregando = false;
    }
  }
}
