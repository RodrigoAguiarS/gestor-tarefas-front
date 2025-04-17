import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CategoriaService } from '../../../services/categoria.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-categoria-create',
    imports: [
      ReactiveFormsModule,
      CommonModule,
      ReactiveFormsModule,
      NzFormModule,
      NzInputModule,
      NzButtonModule,
      NzSpinModule,
      NzCheckboxModule,
      NzCardModule,
    ],
  templateUrl: './categoria-create.component.html',
  styleUrl: './categoria-create.component.css',
})
export class CategoriaCreateComponent {
  categoriaForm!: FormGroup;
  carregando = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly categoriaService: CategoriaService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  criar(): void {
    this.carregando = true;
    this.categoriaService.create(this.categoriaForm.value).subscribe({
      next: (resposta) => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'Categoria - ' + resposta.nome,
            message: 'A Categoria foi criado com sucesso!',
            createRoute: '/categorias/create',
            listRoute: '/categorias/list',
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
        }
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  private initForm(): void {
    this.categoriaForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      ativo: [false, Validators.required],
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
