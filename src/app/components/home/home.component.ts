import { Component, OnInit } from '@angular/core';
import { TarefaService } from '../../services/tarefa.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { UsuarioComTarefasConcluidas } from '../../model/UsuarioComTarefasConcluidas';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UsuarioChangeService } from '../../services/usuario-change.service';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-home',
    imports: [
      CommonModule,
      NzSpinModule,
      NzStatisticModule,
      NzButtonModule,
      NzCardModule,
    ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tarefasCount: { EM_ANDAMENTO: number, PENDENTE: number, CONCLUIDA: number } = { EM_ANDAMENTO: 0, PENDENTE: 0, CONCLUIDA: 0 };
  usuarioComMaisTarefasConcluidas: UsuarioComTarefasConcluidas[] = [];
  carregando = true;
  impersonateAtivo: boolean = false;


  constructor(
    private readonly tarefaService: TarefaService,
    private readonly message: NzMessageService,
    private readonly authService: AuthService,
    private readonly router: Router,
      private readonly userChangeService: UsuarioChangeService
  ) {}

  ngOnInit(): void {
    this.verificarImpersonate();
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

  private verificarImpersonate(): void {
    this.impersonateAtivo = !!localStorage.getItem('impersonateToken');
  }

  public pararImpersonate(): void {
    this.carregando = true;
    this.authService.voltarAoUsuarioAnterior().subscribe({
      next: () => {
        this.impersonateAtivo = false;
        this.userChangeService.notifyUserChanged();
        this.router.navigate(['home']);
      },
      error: (error) => {
        this.message.error(error.message);
        this.carregando = false;
      },
      complete: () => {
        localStorage.removeItem('impersonateToken');
        this.carregando = false;
        this.message.success('Impersonate finalizado com sucesso!');
      }
    });
  }
}
