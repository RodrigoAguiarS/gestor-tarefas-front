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
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { AlertaService } from '../../../services/alerta.service';

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
    NzSkeletonModule,
    NzModalModule,
    NzAlertModule,
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
  modalVisible = false;
  descricaoCompleta = '';
  tarefaSelecionada: Tarefa | null = null;
  nenhumResultadoEncontrado = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly tarefaService: TarefaService,
    private readonly usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder,
    private readonly pdfService: PdfService,
    public readonly alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarUsuarios();
    this.alertaService.limparAlerta();
  }

  private initForm(): void {
    this.filtroForm = this.formBuilder.group({
      id: [''],
      titulo: [''],
      descricao: [''],
      responsavelId: [''],
      situacao: [''],
    });
  }

  private carregarUsuarios(): void {
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
      descricao:
        this.filtroForm.get('descricao')?.value.trim().toLowerCase() || '',
    };
    this.tarefaService.buscarPaginado(params).subscribe({
      next: (response) => {
        this.tarefas = response.content;
        this.totalElementos = response.totalElements;
        this.nenhumResultadoEncontrado = this.tarefas.length === 0;
        this.carregando = false;
        if (this.nenhumResultadoEncontrado) {
          this.alertaService.mostrarAlerta('info', 'Nenhum resultado encontrado.');
        } else {
          this.alertaService.mostrarAlerta('success', 'Tarefas carregados com sucesso.');
        }
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

  abrirModalTarefa(tarefa: Tarefa): void {
    this.tarefaSelecionada = tarefa;
    this.modalVisible = true;
  }

  fecharModal(): void {
    this.modalVisible = false;
    this.tarefaSelecionada = null;
  }

  aoMudarPagina(pageIndex: number): void {
    this.paginaAtual = pageIndex;
    this.buscarTarefa();
  }

  exportarTarefaParaPDF(tarefa: Tarefa): void {
    this.pdfService.exportarTarefaParaPDF(tarefa);
  }
}
