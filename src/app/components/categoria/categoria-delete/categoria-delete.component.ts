import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  selector: 'app-categoria-delete',
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
  templateUrl: './categoria-delete.component.html',
  styleUrl: './categoria-delete.component.css'
})
export class CategoriaDeleteComponent {

  categoriaForm!: FormGroup;
    carregando = false;
    id!: number;

    constructor(
      private readonly message: NzMessageService,
      private readonly categoriaService: CategoriaService,
      private readonly formBuilder: FormBuilder,
      private readonly route: ActivatedRoute,
      private readonly router: Router
    ) {
      this.iniciarForm();
    }

    ngOnInit(): void {
      this.id = this.route.snapshot.params['id'];
      this.iniciarForm();
      this.carregarPerfis();
    }

    private carregarPerfis(): void {
      this.carregando = true;
      this.categoriaService.findById(this.id).subscribe({
        next: (perfil) => {
          this.categoriaForm.patchValue(perfil);
          this.categoriaForm.disable();
        },
        error: (ex) => {
          this.message.error(ex.error.message);
          this.carregando = false;
        },
        complete: () => (this.carregando = false),
      });
    }

    delete(): void {
      this.carregando = true;
      this.categoriaForm.value.id = this.id;
      this.categoriaService.delete(this.categoriaForm.value.id).subscribe({
        next: () => {
          this.message.success('Categoria excluída com sucesso!');
          this.router.navigate(['/categorias/list']);
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

    private iniciarForm(): void {
      this.categoriaForm = this.formBuilder.group({
        nome: ['', Validators.required],
        descricao: ['', Validators.required],
        ativo: ['', Validators.required],
      });
    }

    cancelar(): void {
      this.router.navigate(['/home']);
    }
  }

