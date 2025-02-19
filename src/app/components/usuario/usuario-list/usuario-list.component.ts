import { CPFPipe } from './../../../../pipe';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { PerfilService } from '../../../services/perfil.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../../model/Usuario';
import { Perfil } from '../../../model/Perfil';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
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
    RouterModule
  ],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  perfis: Perfil[] = [];
  carregando = false;
  totalElementos = 0;
  itensPorPagina = 10;
  paginaAtual = 1;
  filtroForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly usuarioService: UsuarioService,
    private readonly perfilService: PerfilService,
    private readonly message: NzMessageService,
    private readonly router: Router
  ) {
    this.filtroForm = this.fb.group({
      nome: [''],
      cpf: [''],
      email: [''],
      perfilId: [null]
    });
  }

  ngOnInit(): void {
    this.carregarPerfis();
  }

  buscarUsuario(): void {
    this.paginaAtual = 1;
    this.findAllUsuarios();
  }

  findAllUsuarios() {
    this.carregando = true;

    const params = {
      page: this.paginaAtual - 1,
      size: this.itensPorPagina,
      sort: 'email',
      nome: this.filtroForm.get('nome')?.value.trim().toLowerCase(),
      email: this.filtroForm.get('email')?.value.trim().toLowerCase(),
      cpf: this.filtroForm.get('cpf')?.value.replace(/\D/g, ''),
      perfilId: this.filtroForm.get('perfilId')?.value,
    };

    this.usuarioService.buscarPaginado(params).subscribe({
      next: (data) => {
        this.usuarios = data.content;
        this.totalElementos = data.totalElements;
        this.carregando = false;
      },
      error: (e) => {
        this.message.error('Erro ao buscar usuários');
        this.carregando = false;
      },
    });
  }

  carregarPerfis(): void {
    this.perfilService.findAll().subscribe({
      next: (perfis) => {
        this.perfis = perfis;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
      },
    });
  }

  aoMudarPagina(pagina: number) {
    this.paginaAtual = pagina;
    this.findAllUsuarios();
  }
}
