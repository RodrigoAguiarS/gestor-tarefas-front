
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
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { BuscaBarComponent } from '../../busca-bar/busca-bar.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { AuthService } from '../../../services/auth.service';
import { UsuarioChangeService } from '../../../services/usuario-change.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
@Component({
  selector: 'app-produto-card',
  imports: [
    NzModalModule,
    FormsModule,
    NzInputModule,
    NzBreadCrumbModule,
    NzSelectModule,
    BuscaBarComponent,
    CategoriaFilterPipe,
    ReactiveFormsModule,
    CommonModule,
    NzTagModule,
    NzPageHeaderModule,
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
  carregando = false;
  impersonateAtivo: boolean = false;

  constructor(
    private readonly produtoService: ProdutoService,
    private readonly categoriaService: CategoriaService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly message: NzMessageService,
    private readonly userChangeService: UsuarioChangeService,
    private readonly modalService: NzModalService,
    private readonly buscaService: BuscaService,
    private readonly carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.verificarImpersonate();
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

  getProdutoTag(produto: any): { texto: string; cor: string } {
    if (produto.quantidade === 0) {
      return { texto: 'Indisponível', cor: 'red' };
    } else if (produto.quantidade > produto.quantidadeMinima) {
      return { texto: 'Em Estoque', cor: 'green' };
    } else if (produto.quantidade <= produto.quantidadeMinima && produto.quantidade > 0) {
      return { texto: 'Quantidade Baixa', cor: 'orange' };
    }
    return { texto: '', cor: '' };
  }
}
