import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TarefaService } from '../../../services/tarefa.service';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Usuario } from '../../../model/Usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Prioridade } from '../../../model/Prioridade';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-tarefa-create',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCardModule,
    NzSpinModule,
    NzDatePickerModule,
  ],
  templateUrl: './tarefa-create.component.html',
  styleUrl: './tarefa-create.component.css',
})
export class TarefaCreateComponent {
  tarefaForm!: FormGroup;
  usuarios: Usuario[] = [];
  prioridades = Object.values(Prioridade);
  carregando = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly tarefaService: TarefaService,
    private readonly usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarUsuarios();
  }

  criar(): void {
    if (this.tarefaForm.valid) {
      this.carregando = true;
      this.tarefaService.create(this.tarefaForm.value).subscribe({
        next: (resposta) => {
          this.router.navigate(['/result'], {
            queryParams: {
              type: 'success',
              title:
                'Tarefa de titulo ' + resposta.titulo + ' criado com sucesso!',
              message: 'A Tarefa foi criado com sucesso!',
              createRoute: '/tarefas/create',
              listRoute: '/usuario/list',
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

  carregarUsuarios(): void {
    this.carregando = true;
    this.usuarioService.findAll(0, 10, 'pessoa.nome').subscribe({
      next: (response) => {
        this.usuarios = response.content;
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

  initForm(): void {
    this.tarefaForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      responsavel: ['', Validators.required],
      prioridade: ['', Validators.required],
      deadline: ['', Validators.required],
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
