import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { HistoricoStatusVenda } from '../../../model/HistoricoStatusVenda';
import { HistoricoStatusVendaService } from '../../../services/historico-status-venda.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Venda } from '../../../model/Venda';
import { VendaService } from '../../../services/venda.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { UsuarioChangeService } from '../../../services/usuario-change.service';
import { ClienteRetorno } from '../../../model/ClienteRetorno';
import { Cliente } from '../../../model/Cliente';

@Component({
  selector: 'app-venda-timeline',
  imports: [
    CommonModule,
    NzTimelineModule,
    NzCardModule,
    NzButtonModule,
    NzSpinModule,
    NzIconModule,
  ],
  templateUrl: './venda-timeline.component.html',
  styleUrl: './venda-timeline.component.css'
})
export class VendaTimelineComponent implements OnInit {
  vendaId!: number;
  venda: Venda = new Venda();
  historicoStatus: HistoricoStatusVenda[] = [];
  carregando: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly vendaService: VendaService,
    private readonly userChangeService: UsuarioChangeService,
    private readonly historicoStatusVenda: HistoricoStatusVendaService,
  ) {}

  ngOnInit(): void {
    this.venda.cliente = new ClienteRetorno();
    this.vendaId = +this.route.snapshot.paramMap.get('id')!;
    this.carregarVenda();
    this.carregarHistorico();
    this.userChangeService.userChanged$.subscribe(() => {
      this.venda.cliente = new ClienteRetorno();
      this.carregarVenda();
      this.carregarHistorico();
    });
  }

  carregarVenda(): void {
    this.carregando = true;
    this.vendaService.findById(this.vendaId).subscribe({
      next: (venda) => {
        this.venda = venda;
      },
      error: (error) => {
        console.error('Erro ao carregar a venda:', error);
      },
      complete: () => {
      },
    });
  }

  carregarHistorico(): void {
    this.carregando = true;
    this.historicoStatusVenda.getHistoricoStatus(this.vendaId).subscribe({
      next: (historico) => {
        this.historicoStatus = historico;
      },
      error: (error) => {
        console.error('Erro ao carregar o histórico da venda:', error);
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  getStatusColor(statusNome: string): string {
    const statusColors: { [key: string]: string } = {
      'EM_ANDAMENTO': 'blue',
      'CONCLUIDO': 'green',
      'CANCELADO': 'red',
      'ESTORNADO': 'orange',
      'EM_PREPARACAO': 'cyan',
      'EM_TRANSPORTE': 'purple',
      'ENVIADO': 'gold',
      'ENTREGUE': 'lime',
      'PENDENTE': 'yellow',
    };

    return statusColors[statusNome.toUpperCase()] || 'gray'; // Cor padrão: cinza
  }

  verDetalhesVenda(): void {
    this.router.navigate(['/vendas/timeline', this.vendaId]);
  }
}
