import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Produto } from '../../../model/Produto';
import { Categoria } from '../../../model/Categoria';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProdutoService } from '../../../services/produto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { AlertaService } from '../../../services/alerta.service';
import { NgxCurrencyDirective } from "ngx-currency";
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'app-produto-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzSelectModule,
    NzPaginationModule,
    RouterModule,
    NzPopconfirmModule,
    NzSkeletonModule,
    NzModalModule,
    NgxCurrencyDirective,
    NzAlertModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
  ],
  templateUrl: './produto-list.component.html',
  styleUrl: './produto-list.component.css',
})
export class ProdutoListComponent {
  filtroForm!: FormGroup;
  produtos: Produto[] = [];
  categorias: Categoria[] = [];
  carregando = false;
  totalElementos = 0;
  itensPorPagina = 10;
  paginaAtual = 1;
  modalVisible = false;
  descricaoCompleta = '';
  produtoSelecionado: Produto = {
    id: 0,
    arquivosUrl: [],
    nome: '',
    codigoBarras: '',
    descricao: '',
    preco: 0,
    ativo: false,
    categoria: { nome: '', id: 0, descricao: '', ativo: false },
    quantidade: 0,
  };
  nenhumResultadoEncontrado = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly produtoervice: ProdutoService,
    private readonly categoriaService: CategoriaService,
    private readonly formBuilder: FormBuilder,
    public readonly alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarUsuarios();
    this.alertaService.limparAlerta();
  }

  private initForm(): void {
    this.filtroForm = this.formBuilder.group({
      id: [''],
      nome: [''],
      descricao: [''],
      preco: [0],
      codigoBarras: [''],
      quantidade: [null],
      categoriaId: [null],
      arquivosUrl: [[]],
    });
  }

  private carregarUsuarios(): void {
    this.categoriaService.findAll().subscribe({
      next: (response) => {
        this.categorias = response;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
      },
    });
  }

  buscarProduto(): void {
    this.carregando = true;
    const params = {
      ...this.filtroForm.value,
      page: this.paginaAtual - 1,
      size: this.itensPorPagina,
      nome: this.filtroForm.get('nome')?.value.trim().toLowerCase() ?? '',
      descricao:
        this.filtroForm.get('descricao')?.value.trim().toLowerCase() ?? '',
    };
    this.produtoervice.buscarPaginado(params).subscribe({
      next: (response) => {
        this.produtos = response.content;
        this.totalElementos = response.totalElements;
        this.nenhumResultadoEncontrado = this.produtos.length === 0;
        this.carregando = false;
        if (this.nenhumResultadoEncontrado) {
          this.alertaService.mostrarAlerta(
            'info',
            'Nenhum resultado encontrado.'
          );
        } else {
          this.alertaService.mostrarAlerta(
            'success',
            'Produtos carregados com sucesso.'
          );
        }
      },
      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
    });
  }

  cancel(): void {
    this.message.info('Ação Cancelada');
  }

  abrirModalProduto(produto: Produto): void {
    this.produtoSelecionado = produto;
    this.modalVisible = true;
  }

  fecharModal(): void {
    this.modalVisible = false;
  }

  aoMudarPagina(pageIndex: number): void {
    this.paginaAtual = pageIndex;
    this.buscarProduto();
  }

  onKeyDown(event: KeyboardEvent): void {
    console.log('Tecla pressionada:', event.key);
  }
}
