import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Credenciais } from '../../model/Credenciais';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { ACESSO } from '../../model/Acesso';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule,
    NzAlertModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form: FormGroup = new FormGroup({});
  credenciais: Credenciais = new Credenciais();
  carregando = false;

  constructor(
    private readonly authservice: AuthService,
    private readonly router: Router,
    private readonly message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  logar() {
    if (this.form.valid) {
      this.carregando = true;
      localStorage.removeItem('token');
      this.credenciais = this.form.value;
      this.authservice.authenticate(this.credenciais).subscribe({
        next: (resposta) => {
          const token =
            resposta.headers.get('Authorization')?.substring(7) ?? '';
          this.authservice.successfulLogin(token);

          this.authservice.getUserRoles().subscribe({
            next: (roles) => {
              if (
                roles.includes(ACESSO.ADMINISTRADOR) ||
                roles.includes(ACESSO.OPERADOR)
              ) {
                this.router.navigate(['home']);
              } else if (roles.includes(ACESSO.CLIENTE)) {
                this.router.navigate(['produtos/card']);
              } else {
                this.message.error(
                  'Usuário sem permissão para acessar o sistema.'
                );
              }
            },
            error: (erro) => {
              this.message.error('Erro ao obter os papéis do usuário.');
            },
            complete: () => {
              this.carregando = false;
            },
          });
        },
        error: (error) => {
          console.error('Erro no login:', error);
          this.carregando = false;
          const errorMessage = JSON.parse(error.error).message;
          this.message.error(errorMessage);
        },
        complete: () => {
          this.message.success('Login efetuado com sucesso!');
        },
      });
    }
  }

  validaCampos(): boolean {
    return this.form.valid;
  }
}
