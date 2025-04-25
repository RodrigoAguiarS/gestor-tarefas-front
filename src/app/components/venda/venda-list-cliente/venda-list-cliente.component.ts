import { Component } from '@angular/core';
import { Venda } from '../../../model/Venda';
import { VendaService } from '../../../services/venda.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
@Component({
  selector: 'app-venda-list-cliente',
  imports: [
    CommonModule,
    NzSpinModule,
    NzCollapseModule,
    NzCardModule,
    NzPaginationModule,
    NzButtonModule,
  ],
  templateUrl: './venda-list-cliente.component.html',
  styleUrl: './venda-list-cliente.component.css'
})
export class VendaListClienteComponent {
  vendas: Venda[] = [];
  carregando: boolean = false;
  totalElementos = 0;
  itensPorPagina = 5;
  paginaAtual = 1;

  constructor(private readonly vendaService: VendaService,
              private readonly router: Router,
              private readonly message: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.carregarVendas();
  }

  carregarVendas(): void {
    this.carregando = true;
    const params = {
      page: this.paginaAtual - 1,
      size: this.itensPorPagina,
      sort: 'criadoEm,desc',
    };

    this.vendaService.getVendasCliente(params).subscribe({
      next: (response) => {
        this.vendas = response.content;
        this.totalElementos = response.totalElements;
      },
      error: (error) => {
        this.message.error('Erro ao carregar as vendas:', error);
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  aoMudarPagina(pagina: number): void {
    this.paginaAtual = pagina;
    this.carregarVendas();
  }

  verDetalhesVenda(vendaId: number): void {
    this.router.navigate(['vendas/timeline', vendaId]);
  }
}
