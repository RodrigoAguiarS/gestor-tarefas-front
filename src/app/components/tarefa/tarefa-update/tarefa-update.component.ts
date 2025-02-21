import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Prioridade } from '../../../model/Prioridade';
import { Usuario } from '../../../model/Usuario';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TarefaService } from '../../../services/tarefa.service';
import { UsuarioService } from '../../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tarefa-update',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCardModule,
    NzDatePickerModule,
  ],
  templateUrl: './tarefa-update.component.html',
  styleUrl: './tarefa-update.component.css',
})
export class TarefaUpdateComponent {
  tarefaForm!: FormGroup;
  usuarios: Usuario[] = [];
  prioridades = Object.values(Prioridade);
  id!: number;

  constructor(
    private readonly message: NzMessageService,
    private readonly tarefaservice: TarefaService,
    private readonly usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router

  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.initForm();
    this.carregarUsuarios();
    this.carregarTarafa();
  }

  update(): void {
    this.tarefaForm.value.id = this.id;
    this.tarefaservice.update(this.tarefaForm.value).subscribe({
      next: (resposta) => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title:
              'Tarefa de titulo ' +
              resposta.titulo +
              ' atualizada com sucesso!',
            message: 'A Tarefa foi atualizada com sucesso!',
            createRoute: '/tarefas/create',
            listRoute: '/tarefas/list',
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
    });
  }

  carregarTarafa(): void {
    this.tarefaservice.findById(this.id).subscribe({
      next: (tarefa) => {
        console.log('Tarefa carregada:', tarefa);
        this.tarefaForm.patchValue(tarefa);
        this.tarefaForm.get('responsavel')?.setValue(tarefa.responsavel.id);
      },
      error: (ex) => {
        console.error('Erro ao carregar tarefa:', ex);
        this.message.error(ex.error.message);
      },
    });
  }

  carregarUsuarios(): void {
    this.usuarioService.findAll(0, 100, 'pessoa.nome').subscribe({
      next: (response) => {
        this.usuarios = response.content;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
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
