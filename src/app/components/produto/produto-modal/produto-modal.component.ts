import { Component, Input } from '@angular/core';
import { Produto } from '../../../model/Produto';
import { ItemVenda } from '../../../model/ItemVenda';
import { CarrinhoService } from '../../../services/carrinho.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Venda } from '../../../model/Venda';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produto-modal',
  imports: [CurrencyPipe, CommonModule, NzIconModule, NzButtonModule, CommonModule,
    FormsModule],
  templateUrl: './produto-modal.component.html',
  styleUrl: './produto-modal.component.css',
})
export class ProdutoModalComponent {
  isModalVisible: boolean = true;
  @Input() produto!: Produto;
  itemVenda!: ItemVenda;

  constructor(
    private readonly carrinhoService: CarrinhoService,
    private readonly modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.carrinhoService.calcularValorTotal();
    this.inicializarItemPedido();
  }

  inicializarItemPedido(): void {
    this.itemVenda = {
      produto: this.produto,
      quantidade: 1,
      precoUnitario: this.produto.preco,
      observacao: '',
      valorTotal: this.produto.preco,
      venda: {} as Venda,
    };
  }

  abrirModal(item: any): void {
    this.itemVenda = item;
    this.isModalVisible = true;
  }

  fecharModal(): void {
    this.isModalVisible = false;
  }


  diminuirQuantidade(): void {
    if (this.itemVenda.quantidade > 1) {
      this.itemVenda.quantidade -= 1;
    }
  }

  aumentarQuantidade(): void {
    this.itemVenda.quantidade += 1;
  }

  adicionarAoCarrinho(produto: Produto, quantidade: number, observacao: string): void {
    this.carrinhoService.adicionarProduto(produto, quantidade, observacao);
    console.log('Produto adicionado ao carrinho:', produto, quantidade, observacao);
    this.modalService.closeAll();
  }

  trocarImagemPrincipal(imagem: string): void {
    const index = this.itemVenda.produto.arquivosUrl.indexOf(imagem);
    if (index > -1) {
      this.itemVenda.produto.arquivosUrl.splice(index, 1);
      this.itemVenda.produto.arquivosUrl.unshift(imagem);
    }
  }

  getMiniaturas(): string[] {

    return this.itemVenda.produto.arquivosUrl.slice(1);
  }

  onKeyDown(event: KeyboardEvent): void {
    console.log('Tecla pressionada:', event.key);
  }
}
