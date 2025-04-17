import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CategoriaService } from '../../../services/categoria.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-categoria-update',
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
  templateUrl: './categoria-update.component.html',
  styleUrl: './categoria-update.component.css',
})
export class CategoriaUpdateComponent {
  categoriaForm!: FormGroup;
  id!: number;
  carregando = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly categoriaService: CategoriaService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.initForm();
    this.carregarCategoria();
  }

  private carregarCategoria(): void {
    this.carregando = true;
    this.categoriaService.findById(this.id).subscribe({
      next: (categoria) => {
        this.categoriaForm.patchValue(categoria);
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

  update(): void {
    this.carregando = true;
    this.categoriaForm.value.id = this.id;
    this.categoriaService.update(this.categoriaForm.value).subscribe({
      next: (resposta) => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'Categoria - ' + resposta.nome,
            message: 'A Categoria foi atualizada com sucesso!',
            createRoute: '/categorias/create',
            listRoute: '/categorias/list',
          },
        });
      },
      error: (ex) => {
        if (ex.error.errors) {
          ex.error.errors.forEach((element: ErrorEvent) => {
            this.message.error(element.message);
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
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
