import { Component } from '@angular/core';
import { Categoria } from '../../../model/Categoria';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { CategoriaService } from '../../../services/categoria.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProdutoService } from '../../../services/produto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-produto-delete',
    imports: [
      ReactiveFormsModule,
      CommonModule,
      NzFormModule,
      NzInputModule,
      NzButtonModule,
      NzSelectModule,
      NzCardModule,
      NzSpinModule,
      NzUploadModule,
      NgxCurrencyDirective,
      NzDatePickerModule,
    ],
  templateUrl: './produto-delete.component.html',
  styleUrl: './produto-delete.component.css',
})
export class ProdutoDeleteComponent {
  produtoForm!: FormGroup;
  categorias: Categoria[] = [];
  fileList: NzUploadFile[] = [];

  id!: number;
  carregando = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly produtoService: ProdutoService,
    private readonly categoriaService: CategoriaService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.initForm();
    this.carregarProdutos();
    this.carregarCategorias();
  }

  delete(): void {
    this.carregando = true;
    this.produtoService.delete(this.id).subscribe({
      next: () => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'Produto deletado com sucesso!',
            message: 'O Produto foi deletado com sucesso!',
            createRoute: '/produtos/create',
            listRoute: '/produtos/list',
          },
        });
      },
      error: (ex) => {
        if (ex.error.errors) {
          ex.error.errors.forEach((element: ErrorEvent) => {
            this.message.error(element.message);
            this.carregando = false;
          });
        } else {
          this.message.error(ex.error.message);
          this.carregando = false;
        }
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  private carregarProdutos(): void {
    this.carregando = true;
    this.produtoService.findById(this.id).subscribe({
      next: (tarefa) => {
        this.produtoForm.patchValue(tarefa);
        this.produtoForm.get('categoriaId')?.setValue(tarefa.categoria.id);
        this.produtoForm.disable();
        this.fileList = tarefa.arquivosUrl.map((url, index) => ({
          uid: `${index}`,
          name: `${url.substring(url.lastIndexOf('/')) + 1}`,
          status: 'done',
          url: url,
        }));
      },

      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  private carregarCategorias(): void {
    this.carregando = true;
    this.categoriaService.findAll().subscribe({
      next: (response) => {
        this.categorias = response;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  private initForm(): void {
    this.produtoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      preco: [0, [Validators.required, Validators.min(0)]],
      codigoBarras: ['', Validators.required],
      quantidade: [null, [Validators.required, Validators.min(0)]],
      categoriaId: [null, Validators.required],
      arquivosUrl: [[]],
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
