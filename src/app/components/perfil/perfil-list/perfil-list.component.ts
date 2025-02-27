import { Component } from '@angular/core';
import { Perfil } from '../../../model/Perfil';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PerfilService } from '../../../services/perfil.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-perfil-list',
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NzTableModule,
      NzButtonModule,
      NzIconModule,
      NzPaginationModule,
      RouterModule
    ],
  templateUrl: './perfil-list.component.html',
  styleUrl: './perfil-list.component.css'
})
export class PerfilListComponent {

  perfis: Perfil[] = [];
  loading: boolean = true;
  totalElementos = 0;
  itensPorPagina = 10;
  paginaAtual = 1;

  constructor(
    private readonly perfilService: PerfilService,
    private readonly message: NzMessageService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.findAllPerfis();
  }

  private findAllPerfis() {
    this.loading = true;
    this.perfilService.findAllPaginada(this.paginaAtual - 1, this.itensPorPagina).subscribe({
      next: (response) => {
        this.perfis = response.content;
        this.totalElementos = response.totalElements;
        this.loading = false;
      },
      error: (e) => {
        this.message.error(e);
        this.loading = false;
      }
    });
  }

  aoMudarPagina(pageIndex: number): void {
    this.paginaAtual = pageIndex;
    this.findAllPerfis();
  }

  entrarCadastro() {
    this.router.navigate(['perfis/create']);
  }
}
