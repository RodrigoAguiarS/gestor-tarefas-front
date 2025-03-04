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
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { API_CONFIG } from '../../../config/api.config';

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
    NzUploadModule,
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
  uploadUrl = API_CONFIG.baseUrl + '/s3/upload';

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
                'Tarefa de Título - ' + resposta.titulo,
              message: 'A Tarefa foi criado com sucesso!',
              createRoute: '/tarefas/create',
              listRoute: '/tarefas/list',
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

  private carregarUsuarios(): void {
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

  private initForm(): void {
    this.tarefaForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      responsavel: ['', Validators.required],
      prioridade: ['', Validators.required],
      deadline: ['', Validators.required],
      arquivosUrl: [[]],
    });
  }

  aoMudarUpload(event: NzUploadChangeParam): void {
    if (event.file.status === 'done') {
      let response = event.file.response;
      if (typeof response === 'object' && response.url) {
        response = response.url;
      }
      const arquivoUrl = typeof response === 'string' ? response.trim() : '';

      if (arquivoUrl) {
        const arquivosAtuais = this.tarefaForm.get('arquivosUrl')?.value || [];
        this.tarefaForm.patchValue({
          arquivosUrl: [...arquivosAtuais, arquivoUrl],
        });
      }
    } else if (event.file.status === 'error') {
      this.message.error('Erro ao fazer upload do arquivo');
    }
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
