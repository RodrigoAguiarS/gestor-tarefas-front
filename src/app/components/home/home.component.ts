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
  @ViewChild('barChart') barChart: BaseChartDirective | undefined;
  @ViewChild('pieChart') pieChart: BaseChartDirective | undefined;

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

  public pieChartOptions = {
    responsive: true,
  };
  public pieChartLabels: string[] = ['Em Andamento', 'Pendente', 'Concluída'];
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Tarefas',
        backgroundColor: ['#42A5F5', '#FFA726', '#66BB6A'],
      },
    ],
  };

  constructor(
    private readonly tarefaService: TarefaService,
    private readonly message: NzMessageService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly userChangeService: UsuarioChangeService
  ) {}

  ngOnInit(): void {
    this.carregarGrafico();
    this.verificarImpersonate();
    this.carregarTarefasCount();
    this.forcarCarregamentoGraficos();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.barChart) {
        this.barChart.update();
      }
      if (this.pieChart) {
        this.pieChart.update();
      }
    }, 200);
  }

  private carregarGrafico(): void {
    this.tarefaService.getUsuarioComMaisTarefasConcluidas().subscribe({
      next: (data: UsuarioComTarefasConcluidas[]) => {
        this.barChartData.labels = data.map((item) => item.usuario.pessoa.nome);
        this.barChartData.datasets[0].data = data.map(
          (item) => item.quantidadeTarefasEmAndamento
        );
        this.barChartData.datasets[1].data = data.map(
          (item) => item.quantidadeTarefasPendentes
        );
        this.barChartData.datasets[2].data = data.map(
          (item) => item.quantidadeTarefasConcluidas
        );

        if (this.barChart) {
          this.barChart.update();
        }
      },
      error: (error) => {
        this.message.error(error.error.message);
      },
    });
  }

  private carregarTarefasCount(): void {
    this.tarefaService.getTarefasCountBySituacao().subscribe({
      next: (count) => {
        this.tarefasCount = count;
        this.pieChartData.datasets[0].data = [
          this.tarefasCount.EM_ANDAMENTO,
          this.tarefasCount.PENDENTE,
          this.tarefasCount.CONCLUIDA,
        ];
        if (this.barChart) {
          this.barChart.update();
        }
      },
      error: (error) => {
        this.message.error(error.error.message);
      },
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

  private forcarCarregamentoGraficos(): void {
    const barChartElement = document.getElementById(
      'barChart'
    ) as HTMLCanvasElement;
    const pieChartElement = document.getElementById(
      'pieChart'
    ) as HTMLCanvasElement;

    if (barChartElement) {
      barChartElement.style.display = 'none';
    }
    if (pieChartElement) {
      pieChartElement.style.display = 'none';
    }

    setTimeout(() => {
      if (barChartElement) {
        barChartElement.style.display = 'block';
      }
      if (pieChartElement) {
        pieChartElement.style.display = 'block';
      }

      this.cdr.detectChanges();
      if (this.barChart) {
        this.barChart.update();
      }
      if (this.pieChart) {
        this.pieChart.update();
      }
    }, 100);
  }
}
