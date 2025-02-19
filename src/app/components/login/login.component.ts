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

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form: FormGroup = new FormGroup({});
  credenciais: Credenciais = new Credenciais();

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
      localStorage.removeItem('token');
      this.credenciais = this.form.value;
      this.authservice.authenticate(this.credenciais).subscribe({
        next: (resposta) => {
          const token = resposta.headers.get('Authorization')?.substring(7) ?? '';
          this.authservice.successfulLogin(token);
          this.message.success('Login efetuado com sucesso!');
          this.router.navigate(['home']);
        },
        error: (error) => {
          const errorMessage = JSON.parse(error.error).message;
          this.message.error(errorMessage);
        },
      });
    }
  }

  validaCampos(): boolean {
    return this.form.valid;
  }
}

