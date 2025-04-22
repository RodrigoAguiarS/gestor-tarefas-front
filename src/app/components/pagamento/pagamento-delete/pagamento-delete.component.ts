import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PagamentoService } from '../../../services/pagamento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'app-pagamento-delete',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
    NzInputNumberModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule,
    NzCheckboxModule,
    NzCardModule,
  ],
  templateUrl: './pagamento-delete.component.html',
  styleUrl: './pagamento-delete.component.css',
})
export class PagamentoDeleteComponent {
  pagamentoForm!: FormGroup;
  carregando = false;
  id!: number;

  constructor(
    private readonly message: NzMessageService,
    private readonly pagamentoService: PagamentoService,
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
    this.pagamentoService.findById(this.id).subscribe({
      next: (perfil) => {
        this.pagamentoForm.patchValue(perfil);
        this.pagamentoForm.disable();
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
    this.pagamentoForm.value.id = this.id;
    this.pagamentoService.delete(this.pagamentoForm.value.id).subscribe({
      next: () => {
        this.message.success('Pagamento excluída com sucesso!');
        this.router.navigate(['/pagamentos/list']);
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
    this.pagamentoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      ativo: ['', Validators.required],
      porcentagemAcrescimo: [0, Validators.required],
    });
  }

  bloquearDigitacao(event: KeyboardEvent): void {
    event.preventDefault();
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
