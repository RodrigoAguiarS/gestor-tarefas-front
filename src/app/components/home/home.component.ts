import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzStatisticModule,
    NzButtonModule,
    NzCardModule,
    NgChartsModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  tarefasCount: { EM_ANDAMENTO: number; PENDENTE: number; CONCLUIDA: number } =
    { EM_ANDAMENTO: 0, PENDENTE: 0, CONCLUIDA: 0 };
  usuarioComMaisTarefasConcluidas: UsuarioComTarefasConcluidas[] = [];
  carregando = false;
  impersonateAtivo: boolean = false;

  public barChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        label: 'Tarefas em Andamento',
        backgroundColor: '#42A5F5',
      },
      {
        data: [] as number[],
        label: 'Tarefas Pendentes',
        backgroundColor: '#FFA726',
      },
      {
        data: [] as number[],
        label: 'Tarefas Concluídas',
        backgroundColor: '#66BB6A',
      },
    ],
  };

  constructor(
    private readonly tarefaService: TarefaService,
    private readonly message: NzMessageService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly userChangeService: UsuarioChangeService
  ) {}

  ngOnInit(): void {
    this.carregarGrafico();
    this.verificarImpersonate();
    this.carregarTarefasCount();
  }

  private carregarGrafico(): void {
    this.tarefaService.getUsuarioComMaisTarefasConcluidas().subscribe({
      next: (data: UsuarioComTarefasConcluidas[]) => {
        this.barChartData.labels = data.map((item) => item.usuario.pessoa.nome);
        this.barChartData.datasets[0].data = data.map((item) => item.quantidadeTarefasEmAndamento);
        this.barChartData.datasets[1].data = data.map((item) => item.quantidadeTarefasPendentes);
        this.barChartData.datasets[2].data = data.map((item) => item.quantidadeTarefasConcluidas);

        if (this.chart) {
          this.chart.update();
        }
      },
      error: (error) => {
        this.message.error(error.error.message);
      }
    });
  }

  private carregarTarefasCount(): void {
    this.tarefaService.getTarefasCountBySituacao().subscribe({
      next: (count) => {
        this.tarefasCount = {
          EM_ANDAMENTO: count.EM_ANDAMENTO || 0,
          PENDENTE: count.PENDENTE || 0,
          CONCLUIDA: count.CONCLUIDA || 0
        };
      },
      error: (error) => {
        this.message.error(error.error.message);
      }
    });
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
      },
    });
  }
}
