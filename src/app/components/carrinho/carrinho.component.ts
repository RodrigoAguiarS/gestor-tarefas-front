import { Component } from '@angular/core';
import { CarrinhoService } from '../../services/carrinho.service';
import { ItemVenda } from '../../model/ItemVenda';
import { Router } from '@angular/router';
import { Produto } from '../../model/Produto';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-carrinho',
  imports: [
    NzBadgeModule,
    NzDrawerModule,
    CurrencyPipe,
    CommonModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css',
})
export class CarrinhoComponent {
  carrinhoVisivel = false;
  itensCarrinho: ItemVenda[] = [];
  subTotal: number = 0;
  constructor(
    private readonly carrinhoService: CarrinhoService,
    private readonly router: Router
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
    this.router.navigate(['/pedidos/finalizar']);
  }

  limparCarrinho() {
    this.carrinhoService.limparCarrinho();
    this.close();
  }

  open(): void {
    this.carrinhoVisivel = true;
    this.atualizarValorTotal();
  }

  close(): void {
    this.carrinhoVisivel = false;
  }

  atualizarValorTotal() {
    this.subTotal = this.carrinhoService.calcularValorTotal();
  }
}
