import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PerfilService } from '../../../services/perfil.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-perfil-update',
    imports: [
      ReactiveFormsModule,
      CommonModule,
      ReactiveFormsModule,
      NzFormModule,
      NzInputModule,
      NzButtonModule,
      NzCheckboxModule,
      NzCardModule,
    ],
  templateUrl: './perfil-update.component.html',
  styleUrl: './perfil-update.component.css'
})
export class PerfilUpdateComponent {

  perfilForm!: FormGroup;
  id!: number;

  constructor(
    private readonly message: NzMessageService,
    private readonly perfilService: PerfilService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.initForm();
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    this.perfilService.findById(this.id).subscribe({
      next: (perfil) => {
        this.perfilForm.patchValue(perfil);
      },
      error: (ex) => {
        this.message.error(ex.error.message);
      },
    });
  }

  update(): void {
    this.perfilForm.value.id = this.id;
    this.perfilService.update(this.perfilForm.value).subscribe({
      next: (resposta) => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'Perfil ' + resposta.nome + ' atualizado com sucesso!',
            message: 'O perfil foi atualizado com sucesso!',
            createRoute: '/perfis/create',
          }
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
    });
  }

  initForm(): void {
    this.perfilForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      ativo: ['', Validators.required],
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}

