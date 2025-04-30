import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Usuario } from '../../model/Usuario';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { UsuarioChangeService } from '../../services/usuario-change.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ACESSO } from '../../model/Acesso';

@Component({
  selector: 'app-administracao',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSpinModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
  ],
  templateUrl: './administracao.component.html',
  styleUrl: './administracao.component.css',
})
export class AdministracaoComponent {
  usuario!: Usuario;
  usuarioLogado!: Usuario;
  roles: string[] = [];
  loginComoUsuario: string = '';
  carregando = false;

  form!: FormGroup;

  constructor(
    public authService: AuthService,
    private readonly message: NzMessageService,
    private readonly usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder,
    private readonly userChangeService: UsuarioChangeService,
    private readonly router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.carregando = true;
    this.authService.getUserRoles().subscribe({
      next: (roles: string[]) => {
        this.roles = roles;
      },
      error: (error) => {
        this.message.error(error.message);
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });

    this.usuarioService.usuarioLogado().subscribe({
      next: (usuario: Usuario) => {
        this.usuarioLogado = usuario;
      },
      error: () => {
        this.message.error('Erro ao obter as informações do usuário logado:');
      },
    });
  }

  logarComoUsuario() {
    if (this.form.valid) {
      this.carregando = true;
      const email = this.form.get('email')?.value;
      this.authService.logarComoUsuario(email).subscribe({
        next: () => {
          this.userChangeService.notifyUserChanged();
          if (this.roles.includes(ACESSO.ADMINISTRADOR)) {
            this.router.navigate(['/home']);
          } else if (this.roles.includes(ACESSO.CLIENTE)) {
            this.router.navigate(['/produtos/card']);
          }
          this.message.success('Login realizado com sucesso!');
        },
        error: (error) => {
          this.message.error(error.message);
          console.error(error);
        },
        complete: () => {
          this.carregando = false;
        },
      });
    } else {
      this.message.info('Formulário inválido:');
      this.carregando = false;
    }
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
