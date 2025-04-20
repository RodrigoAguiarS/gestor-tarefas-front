import { Component } from '@angular/core';
import { PagamentoService } from '../../../services/pagamento.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
@Component({
  selector: 'app-pagamento-create',
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
  templateUrl: './pagamento-create.component.html',
  styleUrl: './pagamento-create.component.css',
})
export class PagamentoCreateComponent {
  categoriaForm!: FormGroup;
  carregando = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly pagamentoService: PagamentoService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  criar(): void {
    this.carregando = true;
    this.pagamentoService.create(this.categoriaForm.value).subscribe({
      next: (resposta) => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'Pagamento - ' + resposta.nome,
            message: 'O Pagamento foi criado com sucesso!',
            createRoute: '/pagamentos/create',
            listRoute: '/pagamentos/list',
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
      porcentagemAcrescimo: [0, Validators.required],
      ativo: [false, Validators.required],
    });
  }

  bloquearDigitacao(event: KeyboardEvent): void {
    event.preventDefault(); // Impede qualquer entrada de teclado
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
