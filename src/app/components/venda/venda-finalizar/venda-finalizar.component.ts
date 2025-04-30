import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemVenda } from '../../../model/ItemVenda';
import { Pagamento } from '../../../model/Pagamento';
import { ClienteService } from '../../../services/cliente.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CarrinhoService } from '../../../services/carrinho.service';
import { PagamentoService } from '../../../services/pagamento.service';
import { Produto } from '../../../model/Produto';
import { Status } from '../../../model/Status';
import { Venda } from '../../../model/Venda';
import { VendaService } from '../../../services/venda.service';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TipoVenda } from '../../../model/TipoVenda';
import { Router } from '@angular/router';
import { UsuarioChangeService } from '../../../services/usuario-change.service';
import { Cliente } from '../../../model/Cliente';
import { ClienteRetorno } from '../../../model/ClienteRetorno';
@Component({
  selector: 'app-venda-finalizar',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzCollapseModule,
    NzListModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzSelectModule,
    NzStatisticModule,
    NzResultModule
],
  templateUrl: './venda-finalizar.component.html',
  styleUrl: './venda-finalizar.component.css'
})
export class VendaFinalizarComponent {

  vendaForm!: FormGroup;
  itensCarrinho: ItemVenda[] = [];
  pagamentos: Pagamento[] = [];
  cliente!: ClienteRetorno;
  valorParcial: number = 0;
  valorTotal: number = 0;
  acrescimo: number = 0;
  formaPagamentoLabel: string = '';
  pedidoRealizado: boolean = false;
  carregando: boolean = false;

  constructor(
    private readonly messege: NzMessageService,
    private readonly clienteService: ClienteService,
    private readonly router: Router,
    private readonly carrinhoService: CarrinhoService,
    private readonly mensagemService: NzMessageService,
    private readonly vendaService: VendaService,
    private readonly userChangeService: UsuarioChangeService,
    private readonly pagamentoService: PagamentoService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregaUsuario();
    this.findAllPagamentos();
    this.carrinhoService.itensCarrinho$.subscribe((itens) => {
      this.itensCarrinho = itens;
      this.vendaForm.get('itens')?.setValue(itens);
      this.atualizarValores();
    });
    this.vendaForm
      .get('pagamento')
      ?.valueChanges.subscribe((value: Pagamento) => {
        if (value) {
          this.formaPagamentoLabel = value.nome || '';
          this.acrescimo = value.porcentagemAcrescimo || 0;
          this.atualizarValores();
        }
      });
  }

  initForm(): void {
    this.vendaForm = this.formBuilder.group({
      cliente: [null, Validators.required],
      pagamento: [null, Validators.required],
      itens: [null, Validators.required],
    });
  }

  carregaUsuario(): void {
    this.clienteService.usuarioLogado().subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.vendaForm.patchValue({
          cliente: cliente,
        });
      },
      error: (ex) => {
        this.messege.error(ex.error.message);
      },
    });
  }

  findAllPagamentos(): void {
    this.pagamentoService.findAll().subscribe((resposta) => {
      this.pagamentos = resposta;
    });
  }

  aumentarQuantidade(produto: Produto) {
    this.carrinhoService.adicionarProduto(produto, 1);
    this.atualizarValores();
  }

  diminuirQuantidade(produto: Produto) {
    this.carrinhoService.diminuirQuantidade(produto.id, 1);
    this.atualizarValores();
  }

  removerItem(produtoId: number) {
    this.carrinhoService.removerProduto(produtoId);
    this.atualizarValores();
  }

  finalizarVenda(): void {
    this.carregando = true;
    if (this.vendaForm.valid) {
      const venda: Venda = {
        id: 0,
        cliente: this.vendaForm.value.cliente.id,
        itens: this.itensCarrinho,
        status: new Status(),
        tipoVenda: TipoVenda.VENDA_ONLINE,
        dataVenda: new Date(),
        valorTotal: this.valorTotal,
        pagamento: this.vendaForm.value.pagamento.id,
      };

      this.vendaService.create(venda).subscribe({
        next: (resposta) => {
          this.mensagemService.success('Pedido realizado com sucesso!');
          this.carrinhoService.limparCarrinho();
          this.pedidoRealizado = true;
          this.vendaForm.reset();
          this.router.navigate(['/vendas/timeline/', resposta.id]);
        },
        complete: () => {
          this.carregando = false;
          this.userChangeService.notifyUserChanged();
        },
        error: (ex) => {
          console.log(ex);
          this.carregando = false;
          this.mensagemService.error(ex.error.message);
        },
      });
    } else {
      this.mensagemService.error('Formulário inválido!');
    }
  }

  atualizarValores() {
    this.valorParcial = +this.itensCarrinho
      .reduce((total, item) => total + item.produto.preco * item.quantidade, 0)
      .toFixed(2);
    this.valorTotal = +(
      this.valorParcial +
      (this.valorParcial * this.acrescimo) / 100
    ).toFixed(2);
  }
}
