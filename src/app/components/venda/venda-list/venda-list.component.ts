import { VendaService } from './../../../services/venda.service';
import { Component } from '@angular/core';
import { Status } from '../../../model/Status';
import { Pagamento } from '../../../model/Pagamento';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { StatusService } from '../../../services/status.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AlertaService } from '../../../services/alerta.service';
import { PagamentoService } from '../../../services/pagamento.service';
import { Venda } from '../../../model/Venda';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NgxCurrencyDirective } from 'ngx-currency';
import { StatusModalComponent } from '../../status/status-modal/status-modal.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { UsuarioChangeService } from '../../../services/usuario-change.service';
import { Cliente } from '../../../model/Cliente';

@Component({
  selector: 'app-venda-list',
  imports: [
    CommonModule,
    NzInputNumberModule,
    FormsModule,
    NzModalModule,
    ReactiveFormsModule,
    NzTableModule,
    NzDatePickerModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NgxCurrencyDirective,
    NzPaginationModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzAlertModule,
  ],
  templateUrl: './venda-list.component.html',
  styleUrl: './venda-list.component.css',
})
export class VendaListComponent {
  clientes: Cliente[] = [];
  vendas: Venda[] = [];
  status: Status[] = [];
  pagamentos: Pagamento[] = [];
  carregando = false;
  totalElementos = 0;
  itensPorPagina = 10;
  paginaAtual = 1;
  filtroForm: FormGroup;
  nenhumResultadoEncontrado = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly vendaService: VendaService,
    private readonly modal: NzModalService,
    private readonly statusService: StatusService,
    private readonly userChangeService: UsuarioChangeService,
    private readonly pagamentoService: PagamentoService,
    private readonly message: NzMessageService,
    public readonly alertaService: AlertaService
  ) {
    this.filtroForm = this.fb.group({
      id: [''],
      nomeCliente: [''],
      status: [''],
      formaPagamento: [''],
      valorMinimo: [''],
      valorMaximo: [''],
      dataInicio: [''],
      dataFim: [''],
    });
  }

  ngOnInit(): void {
    this.carregarStatus();
    this.carregarPagamentos();
    this.alertaService.limparAlerta();
    this.userChangeService.userChanged$.subscribe(() => {
      this.carregarStatus();
      this.carregarPagamentos();
      this.alertaService.limparAlerta();
      this.findAllVendas();
    });
  }

  buscarVenda(): void {
    this.paginaAtual = 1;
    this.findAllVendas();
  }

  private findAllVendas() {
    this.carregando = true;

    const formatarData = (data: string | null): string | null => {
      if (!data) return null;
      const date = new Date(data);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(date.getDate()).padStart(2, '0')} ${String(
        date.getHours()
      ).padStart(2, '0')}:${String(date.getMinutes()).padStart(
        2,
        '0'
      )}:${String(date.getSeconds()).padStart(2, '0')}.${String(
        date.getMilliseconds()
      ).padStart(3, '0')}`;
    };

    const params = {
      page: this.paginaAtual - 1,
      size: this.itensPorPagina,
      sort: 'id',
      id: this.filtroForm.get('id')?.value,
      nomeCliente: this.filtroForm
        .get('nomeCliente')
        ?.value?.trim()
        .toLowerCase(),
      status: this.filtroForm.get('status')?.value,
      formaPagamento: this.filtroForm.get('formaPagamento')?.value,
      valorMinimo: this.filtroForm.get('valorMinimo')?.value,
      valorMaximo: this.filtroForm.get('valorMaximo')?.value,
      dataInicio:
        formatarData(this.filtroForm.get('dataInicio')?.value) ?? undefined,
      dataFim: formatarData(this.filtroForm.get('dataFim')?.value) ?? undefined,
    };

    this.vendaService.buscarPaginado(params).subscribe({
      next: (data) => {
        this.vendas = data.content;
        this.totalElementos = data.totalElements;
        this.nenhumResultadoEncontrado = data.totalElements === 0;
        this.carregando = false;
        if (this.nenhumResultadoEncontrado) {
          this.alertaService.mostrarAlerta(
            'info',
            'Nenhum resultado encontrado.'
          );
        } else {
          this.alertaService.mostrarAlerta(
            'success',
            'Usuários carregados com sucesso.'
          );
        }
      },
      error: (e) => {
        this.message.error('Erro ao buscar usuários');
        this.alertaService.mostrarAlerta('error', 'Erro ao buscar usuários.');
        this.carregando = false;
      },
    });
  }

  private carregarPagamentos(): void {
    this.pagamentoService.findAll().subscribe({
      next: (pagamentos) => {
        this.pagamentos = pagamentos;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
      },
    });
  }

  private carregarStatus(): void {
    this.statusService.findAll().subscribe({
      next: (status) => {
        this.status = status;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
      },
    });
  }

  aoMudarPagina(pagina: number) {
    this.paginaAtual = pagina;
    this.findAllVendas();
  }

  podeAlterarStatus(venda: Venda): boolean {
    // Implementar lógica de permissão
    return true;
  }

  abrirModalStatus(venda: Venda): void {
    this.carregando = true;
    this.statusService.getProximosStatus(venda.id, venda.tipoVenda).subscribe({
      next: (statusPossiveis: Status[]) => {
        const modal = this.modal.create({
          nzTitle: 'Alterar Status da Venda',
          nzContent: StatusModalComponent,
          nzFooter: null,
        });

        modal.afterClose.subscribe((result) => {
          if (result) {
            this.findAllVendas();
          }
        });

        const instance = modal.getContentComponent();
        if (instance) {
          instance.venda = venda;
          instance.statusPossiveis = statusPossiveis;
        }
      },
      complete: () => {
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar os status possíveis:', error);
        this.message.error('Erro ao carregar os status possíveis.');
      },
    });
  }
}
