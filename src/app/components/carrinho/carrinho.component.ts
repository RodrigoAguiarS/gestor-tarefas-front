// carrinho.component.ts
import { Component } from '@angular/core';
import { CarrinhoService } from '../../services/carrinho.service';
import { ItemVenda } from '../../model/ItemVenda';
import { Router } from '@angular/router';
import { Produto } from '../../model/Produto';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-carrinho',
  imports: [
    NzBadgeModule,
    NzModalModule,
    CurrencyPipe,
    CommonModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css',
})
export class CarrinhoComponent {
  modalVisivel = false;
  itensCarrinho: ItemVenda[] = [];
  subTotal: number = 0;

  constructor(
    private readonly carrinhoService: CarrinhoService,
    private readonly router: Router,
    private readonly modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.carrinhoService.itensCarrinho$.subscribe((itens) => {
      this.itensCarrinho = itens;
    });
  }

  diminuirQuantidade(produto: Produto) {
    this.carrinhoService.diminuirQuantidade(produto.id, 1);
    this.atualizarValorTotal();
  }

  aumentarQuantidade(produto: Produto) {
    this.carrinhoService.adicionarProduto(produto, 1);
    this.atualizarValorTotal();
  }

  removerItem(produtoId: number) {
    this.carrinhoService.removerProduto(produtoId);
    this.atualizarValorTotal();
  }

  finalizarPedido() {
    this.close();
    this.router.navigate(['/vendas/finalizar']);
  }

  limparCarrinho() {
    this.modalService.confirm({
      nzTitle: 'Confirmar',
      nzContent: 'Deseja realmente limpar o carrinho?',
      nzOkText: 'Sim',
      nzCancelText: 'Não',
      nzOnOk: () => {
        this.carrinhoService.limparCarrinho();
        this.close();
      }
    });
  }

  open(): void {
    this.modalVisivel = true;
    this.atualizarValorTotal();
  }

  close(): void {
    this.modalVisivel = false;
  }

  atualizarValorTotal() {
    this.subTotal = this.carrinhoService.calcularValorTotal();
  }
}
