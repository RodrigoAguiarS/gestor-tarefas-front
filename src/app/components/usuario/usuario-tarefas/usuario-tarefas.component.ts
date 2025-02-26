import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { TarefaService } from '../../../services/tarefa.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Tarefa } from '../../../model/Tarefa';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../model/Usuario';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Situacao } from '../../../model/Situacao';
import { Prioridade } from '../../../model/Prioridade';
import { PdfService } from '../../../services/pdf.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-usuario-tarefas',
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
    NzModalModule,
  ],
  templateUrl: './usuario-tarefas.component.html',
  styleUrl: './usuario-tarefas.component.css',
})
export class UsuarioTarefasComponent implements OnInit {
  tarefas: Tarefa[] = [];
  filtroForm!: FormGroup;
  situacoes = Object.values(Situacao).filter(
    (situacao) => situacao !== Situacao.CONCLUIDA
  );
  prioridades = Object.values(Prioridade);
  carregando = false;
  totalElementos = 0;
  itensPorPagina = 10;
  paginaAtual = 1;
  usuarioId!: number;
  modalVisible = false;
  descricaoCompleta = '';
  tarefaSelecionada: Tarefa | null = null;

  constructor(
    private readonly tarefaService: TarefaService,
    private readonly formBuilder: FormBuilder,
    private readonly usuarioService: UsuarioService,
    private readonly message: NzMessageService,
    private readonly pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.filtroForm = this.formBuilder.group({
      id: [''],
      titulo: [''],
      descricao: [''],
      situacao: [''],
      prioridade: [''],
    });

    this.carregarUsuario();
  }

  private carregarUsuario(): void {
    this.usuarioService.usuarioLogado().subscribe({
      next: (usuario: Usuario) => {
        this.usuarioId = usuario.id;
        this.buscarTarefas();
      },
      error: (error) => {
        this.message.error(error.error.message);
      },
    });
  }

  buscarTarefas(): void {
    this.carregando = true;
    const params = {
      ...this.filtroForm.value,
      page: this.paginaAtual - 1,
      size: this.itensPorPagina,
      responsavelId: this.usuarioId,
      titulo: this.filtroForm.get('titulo')?.value.trim().toLowerCase() || '',
      descricao:
        this.filtroForm.get('descricao')?.value.trim().toLowerCase() || '',
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

  concluirTarefa(id: number): void {
    this.carregando = true;
    this.tarefaService.concluirTarefa(id).subscribe({
      next: () => {
        this.message.success(`Tarefa ${id} concluída com sucesso!`);
        this.buscarTarefas();
      },
      error: (ex) => {
        this.message.error(`Erro ao concluir a tarefa: ${ex.error.message}`);
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  abrirModalTarefa(tarefa: Tarefa): void {
    this.tarefaSelecionada = tarefa;
    this.modalVisible = true;
  }

  fecharModal(): void {
    this.modalVisible = false;
    this.tarefaSelecionada = null;
  }

  colocarEmAndamento(id: number): void {
    this.carregando = true;
    this.tarefaService.andamentoTarefa(id).subscribe({
      next: () => {
        this.message.success(`Tarefa ${id} foi colocada em andamento!`);
        this.buscarTarefas();
      },
      error: (ex) => {
        this.message.error(
          `Erro ao colocar a tarefa em andamento: ${ex.error.message}`
        );
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  aoMudarPagina(pageIndex: number): void {
    this.paginaAtual = pageIndex;
    this.buscarTarefas();
  }

  exportarTarefaParaPDF(tarefa: Tarefa): void {
    this.pdfService.exportarTarefaParaPDF(tarefa);
  }
}
