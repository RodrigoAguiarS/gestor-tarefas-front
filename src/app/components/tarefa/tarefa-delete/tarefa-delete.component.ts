import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Prioridade } from '../../../model/Prioridade';
import { Usuario } from '../../../model/Usuario';
import { TarefaService } from '../../../services/tarefa.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-tarefa-delete',
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
  templateUrl: './tarefa-delete.component.html',
  styleUrl: './tarefa-delete.component.css',
})
export class TarefaDeleteComponent {
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

  delete(): void {
    this.tarefaservice.delete(this.id).subscribe({
      next: () => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'Tarefa deletada com sucesso!',
            message: 'A Tarefa foi deletada com sucesso!',
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
        this.tarefaForm.disable();
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
