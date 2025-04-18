import { CategoriaService } from './../../../services/categoria.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria } from '../../../model/Categoria';
import { API_CONFIG } from '../../../config/api.config';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { ProdutoService } from '../../../services/produto.service';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxCurrencyDirective } from "ngx-currency";
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-produto-create',
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
  templateUrl: './produto-create.component.html',
  styleUrl: './produto-create.component.css',
})
export class ProdutoCreateComponent {
  produtoForm!: FormGroup;
  categorias: Categoria[] = [];
  carregando = false;
  uploadUrl = API_CONFIG.baseUrl + '/s3/upload';
  uploadUrlStorage = API_CONFIG.baseUrl + '/storage/produto/';

  constructor(
    private readonly message: NzMessageService,
    private readonly produtoService: ProdutoService,
    private readonly categoriaService: CategoriaService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarCategoria();
  }

  criar(): void {
    if (this.produtoForm.valid) {
      this.carregando = true;
      this.produtoService.create(this.produtoForm.value).subscribe({
        next: (resposta) => {
          this.router.navigate(['/result'], {
            queryParams: {
              type: 'success',
              title: 'Produto de nome - ' + resposta.nome,
              message: 'O Produto foi criado com sucesso!',
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
  }

  private carregarCategoria(): void {
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

  aoMudarUpload(event: NzUploadChangeParam): void {
    if (event.file.status === 'done') {
      let response = event.file.response;
      if (typeof response === 'object' && response.url) {
        response = response.url;
      }
      const arquivoUrl = typeof response === 'string' ? response.trim() : '';

      if (arquivoUrl) {
        const arquivosAtuais = this.produtoForm.get('arquivosUrl')?.value || [];
        this.produtoForm.patchValue({
          arquivosUrl: [...arquivosAtuais, arquivoUrl],
        });
      }
    } else if (event.file.status === 'error') {
      this.message.error('Erro ao fazer upload do arquivo');
    }
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
