import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemVenda } from '../model/ItemVenda';
import { Produto } from '../model/Produto';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Venda } from '../model/Venda';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private readonly LOCAL_STORAGE_KEY = 'itensCarrinho';
  private readonly itensCarrinhoSubject: BehaviorSubject<ItemVenda[]> =
    new BehaviorSubject<ItemVenda[]>(this.carregarItensDoLocalStorage());

  public itensCarrinho$: Observable<ItemVenda[]> =
    this.itensCarrinhoSubject.asObservable();

  constructor(private readonly mensagemService: NzMessageService) {}

  adicionarProduto(produto: Produto, quantidade: number = 1, observacao: string = ''): void {
    const itensCarrinhoAtual = this.itensCarrinhoSubject.value;
    const itemIndex = itensCarrinhoAtual.findIndex(
      (item) => item.produto.id === produto.id
    );

    if (itemIndex !== -1) {
      const novaQuantidade =
        itensCarrinhoAtual[itemIndex].quantidade + quantidade;
      if (novaQuantidade <= produto.quantidade) {
        itensCarrinhoAtual[itemIndex].quantidade = novaQuantidade;
        itensCarrinhoAtual[itemIndex].valorTotal =
          itensCarrinhoAtual[itemIndex].quantidade *
          itensCarrinhoAtual[itemIndex].precoUnitario;
        itensCarrinhoAtual[itemIndex].observacao = observacao;
      } else {
        this.mensagemService.error(
          'Não é possível adicionar mais deste produto devido à limitação de estoque.'
        );
        return;
      }
    } else if (quantidade <= produto.quantidade) {
      const precoUnitario = produto.preco;
      const valorTotal = quantidade * precoUnitario;

      const novoItem: ItemVenda = {
        produto,
        quantidade,
        observacao, // Adiciona a observação ao novo item
        venda: new Venda(),
        precoUnitario,
        valorTotal,
      };
      itensCarrinhoAtual.push(novoItem);
      this.mensagemService.success(
        'O Produto ' + produto.nome + ' foi adicionado ao carrinho.'
      );
    } else {
      this.mensagemService.error(
        'Não é possível adicionar este produto devido à limitação de estoque.'
      );
      return;
    }
    this.itensCarrinhoSubject.next(itensCarrinhoAtual);
    this.salvarItensNoLocalStorage(itensCarrinhoAtual);
  }

  removerProduto(produtoId: number): void {
    const itensCarrinhoAtual = this.itensCarrinhoSubject.value;
    const itemExiste = itensCarrinhoAtual.some(
      (item) => item.produto.id === produtoId
    );

    if (itemExiste) {
      const itensAtualizados = itensCarrinhoAtual.filter(
        (item) => item.produto.id !== produtoId
      );
      this.itensCarrinhoSubject.next(itensAtualizados);
      this.mensagemService.success('Produto removido com sucesso.');
    } else {
      this.mensagemService.error('Produto não encontrado no carrinho.');
    }
  }

  diminuirQuantidade(produtoId: number, quantidade: number = 1): void {
    const itensCarrinhoAtual = this.itensCarrinhoSubject.value;
    const itemIndex = itensCarrinhoAtual.findIndex(
      (item) => item.produto.id === produtoId
    );

    if (itemIndex !== -1) {
      itensCarrinhoAtual[itemIndex].quantidade -= quantidade;
      if (itensCarrinhoAtual[itemIndex].quantidade <= 0) {
        itensCarrinhoAtual.splice(itemIndex, 1);
      } else {
        itensCarrinhoAtual[itemIndex].valorTotal =
          itensCarrinhoAtual[itemIndex].quantidade *
          itensCarrinhoAtual[itemIndex].precoUnitario;
      }
      this.itensCarrinhoSubject.next(itensCarrinhoAtual);
    }
  }

  calcularValorTotal(): number {
    return this.itensCarrinhoSubject.value.reduce(
      (total, item) => total + item.quantidade * item.produto.preco,
      0
    );
  }

  limparCarrinho(): void {
    this.itensCarrinhoSubject.next([]);
    localStorage.removeItem(this.LOCAL_STORAGE_KEY);
  }

  atualizarItensCarrinho(itens: ItemVenda[]): void {
    this.itensCarrinhoSubject.next(itens);
  }

  private salvarItensNoLocalStorage(itens: ItemVenda[]): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(itens));
  }

  private carregarItensDoLocalStorage(): ItemVenda[] {
    const itens = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return itens ? JSON.parse(itens) : [];
  }
}
