import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsuarioService } from '../../services/usuario.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UsuarioChangeService } from '../../services/usuario-change.service';
import { CommonModule } from '@angular/common';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Endereco } from '../../model/Endereco';
import { Empresa } from '../../model/Empresa';
import { EmpresaService } from '../../services/empresa.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CnpjPipe, FormatarHorarioPipe, TelefonePipe } from '../../../pipe';
@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    NzPageHeaderModule,
    ReactiveFormsModule,
    NzFormModule,
    NzModalModule,
    FormatarHorarioPipe,
    CnpjPipe,
    TelefonePipe,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    NzCollapseModule,
    NzInputModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  usuario: Usuario = new Usuario();
  papel: string[] = [];
  impersonateAtivo: boolean = true;
  empresaAberta: boolean = false;
  modalVisivel: boolean = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly usuarioService: UsuarioService,
    private readonly empresaService: EmpresaService,
    private readonly cdr: ChangeDetectorRef,
    private readonly userChangeService: UsuarioChangeService
  ) {}

  ngOnInit(): void {
    this.carregarUsuario();
    this.verificarEmpresaAberta();
    this.usuario.empresa = new Empresa();
    this.usuario.empresa.endereco = new Endereco();
    this.userChangeService.userChanged$.subscribe(() => {
      this.carregarUsuario();
      this.verificarEmpresaAberta();
    });
  }

  private verificarEmpresaAberta(): void {
    this.empresaService.verificarStatusEmopresa().subscribe({
      next: (empresaAberta: boolean) => {
        this.empresaAberta = empresaAberta;
      },
      error: (error) => {
        this.message.error(error.error.message);
      },
      complete: () => {},
    });
  }

  private carregarUsuario(): void {
    this.usuarioService.usuarioLogado().subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;
        console.log(usuario);
        this.papel = usuario.perfis.map((perfil) => perfil.nome);
      },
      error: (error) => {
        this.message.error(error.error.message);
      },
      complete: () => {},
    });
  }

  abrirModalHorarios(): void {
    console.log(this.usuario.empresa.horariosFuncionamento);
    this.cdr.detectChanges();
    this.modalVisivel = true;
  }

  fecharModalHorarios(): void {
    this.modalVisivel = false;
  }
}
