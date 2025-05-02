import { Component } from '@angular/core';
import { ClienteRetorno } from '../../../model/ClienteRetorno';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AlertaService } from '../../../services/alerta.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CPFPipe } from '../../../../pipe';

@Component({
  selector: 'app-cliente-list',
    imports: [
      CPFPipe,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NzTableModule,
      NzButtonModule,
      NzIconModule,
      NzSelectModule,
      NzPaginationModule,
      RouterModule,
      NzFormModule,
      NzInputModule,
      NzAlertModule,
    ],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css',
})
export class ClienteListComponent {
  clientes: ClienteRetorno[] = [];
  carregando = false;
  totalElementos = 0;
  itensPorPagina = 10;
  paginaAtual = 1;
  filtroForm: FormGroup;
  nenhumResultadoEncontrado = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly clienteService: ClienteService,
    private readonly message: NzMessageService,
    public readonly alertaService: AlertaService
  ) {
    this.filtroForm = this.fb.group({
      nome: [''],
      cpf: [''],
      email: [''],
      cidade: [''],
      estado: [''],
      cep: [''],
    });
  }

  ngOnInit(): void {
    this.alertaService.limparAlerta();
  }

  buscarUsuario(): void {
    this.paginaAtual = 1;
    this.findAllUsuarios();
  }

  private findAllUsuarios() {
    this.carregando = true;

    const params = {
      page: this.paginaAtual - 1,
      size: this.itensPorPagina,
      sort: 'id',
      nome: this.filtroForm.get('nome')?.value.trim().toLowerCase(),
      email: this.filtroForm.get('email')?.value.trim().toLowerCase(),
      cidade: this.filtroForm.get('cidade')?.value,
      estado: this.filtroForm.get('estado')?.value,
      cpf: this.filtroForm.get('cpf')?.value.replace(/\D/g, ''),
      cep: this.filtroForm.get('cep')?.value,
    };

    this.clienteService.buscarPaginado(params).subscribe({
      next: (data) => {
        this.clientes = data.content;
        this.totalElementos = data.totalElements;
        this.nenhumResultadoEncontrado = data.totalElements === 0;
        this.carregando = false;
        if (this.nenhumResultadoEncontrado) {
          this.alertaService.mostrarAlerta(
            'info',
            'Nenhum resultado encontrado.'
          );
        } else {
          this.alertaService.mostrarAlerta(
            'success',
            'Usuários carregados com sucesso.'
          );
        }
      },
      error: (e) => {
        this.message.error('Erro ao buscar usuários');
        this.alertaService.mostrarAlerta('error', 'Erro ao buscar usuários.');
        this.carregando = false;
      },
    });
  }

  aoMudarPagina(pagina: number) {
    this.paginaAtual = pagina;
    this.findAllUsuarios();
  }
}
