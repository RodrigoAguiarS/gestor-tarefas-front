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
  selector: 'app-perfil-delete',
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
  templateUrl: './perfil-delete.component.html',
  styleUrl: './perfil-delete.component.css'
})
export class PerfilDeleteComponent {

  perfilForm!: FormGroup;
  id!: number;

  constructor(
    private readonly message: NzMessageService,
    private readonly perfilService: PerfilService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.iniciarForm();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.iniciarForm();
    this.carregarPerfis();
  }

  private carregarPerfis(): void {
    this.perfilService.findById(this.id).subscribe({
      next: (perfil) => {
        this.perfilForm.patchValue(perfil);
        this.perfilForm.disable();
      },
      error: (ex) => {
        this.message.error(ex.error.message);
      },
    });
  }

  delete(): void {
    this.perfilForm.value.id = this.id;
    this.perfilService.delete(this.perfilForm.value.id).subscribe({
      next: () => {
        this.message.success('Perfil excluído com sucesso!');
        this.router.navigate(['/perfis/list']);
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

  private iniciarForm(): void {
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
