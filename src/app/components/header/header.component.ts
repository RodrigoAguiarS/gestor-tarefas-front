import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsuarioService } from '../../services/usuario.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UsuarioChangeService } from '../../services/usuario-change.service';
import { CommonModule } from '@angular/common';
import { BuscaBarComponent } from '../busca-bar/busca-bar.component';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../model/Categoria';
import { BuscaService } from '../../services/busca.service';
@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    BuscaBarComponent,
    NzInputModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  usuario: Usuario = new Usuario();
  papel: string[] = [];
  impersonateAtivo: boolean = true;
  categorias: Categoria[] = [];

  constructor(
    private readonly message: NzMessageService,
    private readonly usuarioService: UsuarioService,
    private readonly buscaService: BuscaService,
    private readonly categoriaService: CategoriaService,
    private readonly userChangeService: UsuarioChangeService
  ) {}

  ngOnInit(): void {
    this.carregarUsuario();
    this.carregarCategorias();
    this.userChangeService.userChanged$.subscribe(() => {
      this.carregarUsuario();
      this.carregarCategorias();
    });
  }

  private carregarCategorias(): void {
    this.categoriaService.findAll().subscribe((categorias) => {
      this.categorias = categorias;
    });
  }

  private carregarUsuario(): void {
    this.usuarioService.usuarioLogado().subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;
        this.papel = usuario.perfis.map((perfil) => perfil.nome);
      },
      error: (error) => {
        this.message.error(error.error.message);
      },
      complete: () => {},
    });
  }

  atualizarBusca(termo: string): void {
    this.buscaService.atualizarTermoDeBusca(termo);
  }

  atualizarCategoria(categoria: string): void {
    this.buscaService.atualizarCategoriaSelecionada(categoria);
  }
}
