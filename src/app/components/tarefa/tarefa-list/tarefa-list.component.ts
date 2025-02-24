import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Situacao } from '../../../model/Situacao';
import { Usuario } from '../../../model/Usuario';
import { Tarefa } from '../../../model/Tarefa';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TarefaService } from '../../../services/tarefa.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { PdfService } from '../../../services/pdf.service';

@Component({
  selector: 'app-tarefa-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzPaginationModule,
    RouterModule,
    NzPopconfirmModule,
    NzSkeletonModule
  ],
  templateUrl: './tarefa-list.component.html',
  styleUrl: './tarefa-list.component.css',
})
export class TarefaListComponent {
  filtroForm!: FormGroup;
  tarefas: Tarefa[] = [];
  usuarios: Usuario[] = [];
  situacoes = Object.values(Situacao).filter(
    (situacao) => situacao !== Situacao.CONCLUIDA
  );
  carregando = false;
  totalElementos = 0;
  itensPorPagina = 10;
  paginaAtual = 1;

  constructor(
    private readonly message: NzMessageService,
    private readonly tarefaService: TarefaService,
    private readonly usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder,
    private readonly pdfService: PdfService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarUsuarios();
  }

  initForm(): void {
    this.filtroForm = this.formBuilder.group({
      id: [''],
      titulo: [''],
      descricao: [''],
      responsavelId: [''],
      situacao: [''],
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

  buscarTarefa(): void {
    this.carregando = true;
    const params = {
      ...this.filtroForm.value,
      page: this.paginaAtual - 1,
      size: this.itensPorPagina,
      titulo: this.filtroForm.get('titulo')?.value.trim().toLowerCase() || '',
      descricao: this.filtroForm.get('descricao')?.value.trim().toLowerCase() || '',
    };
    this.tarefaService.buscarPaginado(params).subscribe({
      next: (response) => {
        this.tarefas = response.content;
        this.totalElementos = response.totalElements;
        this.carregando = false;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
    });
  }

  cancel(): void {
    this.message.info('Ação Cancelada');
  }

  confirm(id: number): void {
    this.carregando = true;
    this.tarefaService.concluirTarefa(id).subscribe({
      next: () => {
        this.message.success(`Tarefa ${id} concluída com sucesso!`);
        this.buscarTarefa();
      },
      error: (ex) => {
        this.carregando = true;
        this.message.error(`Erro ao concluir a tarefa: ${ex.error.message}`);
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  aoMudarPagina(pageIndex: number): void {
    this.paginaAtual = pageIndex;
    this.buscarTarefa();
  }

  exportarTarefaParaPDF(tarefa: Tarefa): void {
    this.pdfService.exportarTarefaParaPDF(tarefa);
  }
}
