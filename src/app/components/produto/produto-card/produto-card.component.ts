import { BuscaService } from './../../../services/busca.service';
import { Component } from '@angular/core';
import { Produto } from '../../../model/Produto';
import { Categoria } from '../../../model/Categoria';
import { ProdutoService } from '../../../services/produto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { CarrinhoService } from '../../../services/carrinho.service';
import { ProdutoModalComponent } from '../produto-modal/produto-modal.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriaFilterPipe } from '../../../../pipe';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-produto-card',
  imports: [
    NzModalModule,
    FormsModule,
    NzInputModule,
    NzSelectModule,
    CategoriaFilterPipe,
    ReactiveFormsModule,
    CommonModule,
    NzButtonModule,
    NzFormModule,
    NzIconModule,
    NzSpinModule,
    NzCardModule,
    CurrencyPipe,
  ],
  templateUrl: './produto-card.component.html',
  styleUrl: './produto-card.component.css',
})
export class ProdutoCardComponent {
  produtosFiltrados: Produto[] = [];
  produtos: Produto[] = [];
  categorias: Categoria[] = [];
  termoDeBusca: string = '';
  categoriaSelecionada: string = '';
  loading: boolean = true;
  totalElementos = 0;

  constructor(
    private readonly produtoService: ProdutoService,
    private readonly categoriaService: CategoriaService,
    private readonly modalService: NzModalService,
    private readonly buscaService: BuscaService,
    private readonly carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.inscreverBusca();
    this.carregarProdutos();
    this.carregarCategorias();
  }

  carregarProdutos(): void {
    this.loading = true;

    this.produtoService
      .buscarPaginado({
        page: 0,
        size: 100
      })
      .subscribe({
        next: (response) => {
          this.produtos = response.content;
          this.produtosFiltrados = response.content;
          this.totalElementos = response.totalElements;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar produtos:', err);
          this.loading = false;
        },
      });
  }

  carregarCategorias(): void {
    this.categoriaService.findAll().subscribe((categorias) => {
      this.categorias = categorias;
    });
  }

  inscreverBusca(): void {
    this.buscaService.termoDeBusca$.subscribe((termo) => {
      this.filtrarProdutos(termo, '');
    });

    this.buscaService.categoriaSelecionada$.subscribe((categoria) => {
      this.filtrarProdutos('', categoria);
    });
  }

  filtrarProdutos(termo?: string, categoria?: string): void {
    let produtosFiltradosTemp = this.produtos;

    if (termo !== null && termo !== undefined) {
      produtosFiltradosTemp = produtosFiltradosTemp.filter((produto) =>
        produto.nome.toLowerCase().includes(termo.toLowerCase())
      );
    }

    if (categoria !== null && categoria !== undefined && categoria !== '') {
      const categoriaId = Number(categoria);
      produtosFiltradosTemp = produtosFiltradosTemp.filter(
        (produto) => produto.categoria?.id === categoriaId
      );
    }

    this.produtosFiltrados = produtosFiltradosTemp;
  }

  abrirModalProduto(produto: Produto): void {
    const modal = this.modalService.create({
      nzContent: ProdutoModalComponent,
      nzFooter: null,
    });

    const instance = modal.getContentComponent();
    if (instance) {
      instance.produto = produto;
    }
  }

  adicionarAoCarrinho(produto: Produto): void {
    this.carrinhoService.adicionarProduto(produto);
  }

  onKeyDown(event: KeyboardEvent): void {
    console.log('Tecla pressionada', event.key);
  }
}
