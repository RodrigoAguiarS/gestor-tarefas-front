import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UsuarioChangeService } from '../../services/usuario-change.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzStatisticModule,
    NzButtonModule,
    NzCardModule,
    NzEmptyModule,
    NgChartsModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  carregando = false;
  impersonateAtivo: boolean = false;

  chartOptions: any;
  public barChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: {
    data: number[];
    label: string;
    backgroundColor: string[];
  }[] = [];

  public pieChartOptions = {
    responsive: true,
  };
  public pieChartLabels: string[] = [];
  public pieChartType: ChartType = 'bar';
  public pieChartLegend = true;
  public pieChartData: {
    data: number[];
    label: string;
    backgroundColor: string[];
    hoverOffset: 4
  }[] = [];

  public revenueChartOptions = {
    responsive: true,
  };
  public revenueChartLabels: string[] = [];
  public revenueChartType: ChartType = 'line';
  public revenueChartLegend = true;
  public revenueChartData: {
    data: number[];
    label: string;
    backgroundColor: string[];
  }[] = [];

  constructor(
    private readonly message: NzMessageService,
    private readonly authService: AuthService,
    private readonly produtoService: ProdutoService,
    private readonly router: Router,
    private readonly userChangeService: UsuarioChangeService
  ) {}

  ngOnInit(): void {
    this.produtoService.getVendasParaGrafico().subscribe((data) => {
      this.barChartLabels = data.map((item) => item.nome);
      this.barChartData = [
        {
          data: data.map((item) => item.quantidade),
          label: 'Produtos Mais Vendidos',
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ];
    });
    this.carregarGraficoPizza();
    this.carregarGraficoFaturamento();
    this.verificarImpersonate();
  }

  private carregarGraficoPizza(): void {
    this.produtoService.getCategoriasMaisVendidas().subscribe((data) => {
      this.pieChartLabels = data.map((item) => item.nome);
      this.pieChartData = [
        {
          data: data.map((item) => item.quantidade),
          label: 'Categoria de Produto mais vendido',
          backgroundColor: ['#9966FF', '#4BC0C0', '#FFCE56', '#4BC0C0', '#9966FF'],
          hoverOffset: 4,
        },
      ];
    });
  }

  private carregarGraficoFaturamento(): void {
    this.produtoService.getFaturamentoPorProduto().subscribe((data) => {
      this.revenueChartLabels = data.map((item) => item.nome);
      this.revenueChartData = [
        {
          data: data.map((item) => item.valor),
          label: 'Produtos com Maior Faturamento',
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
      ];
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
