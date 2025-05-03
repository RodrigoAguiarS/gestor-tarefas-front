import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Perfil } from '../../../model/Perfil';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PerfilService } from '../../../services/perfil.service';
import { UsuarioService } from '../../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-usuario-update',
  imports: [
      ReactiveFormsModule,
      CommonModule,
      NzFormModule,
      NzInputModule,
      NzButtonModule,
      NzSelectModule,
      NzIconModule,
      NzDatePickerModule,
      NzCardModule,
      NzResultModule,
      NgxMaskDirective,
      NzSpinModule,
      NgxCurrencyDirective,
    ],
  templateUrl: './usuario-update.component.html',
  styleUrl: './usuario-update.component.css'
})
export class UsuarioUpdateComponent {

  usuarioForm!: FormGroup;
  perfis: Perfil[] = [];
  hide: boolean = true;
  id!: number;
  carregando = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly perfilService: PerfilService,
    private readonly usuarioService: UsuarioService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.iniciarForm();
    this.carregarPerfis();
    this.carregarUsuario();
  }

  atualizar(): void {
    this.carregando = true;
    this.usuarioForm.value.id = this.id;
    this.usuarioService.update(this.usuarioForm.value).subscribe({
      next: (resposta) => {
        this.message.success('Usuário atualizada com sucesso.');
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'Usuário de nome - ' + resposta.usuario.pessoa.nome,
            message: 'O usuário foi atualizado com sucesso!',
            createRoute: '/usuarios/create',
            listRoute: '/usuarios/list',
          }
        });
      },
      error: (ex) => {
        if (ex.error.errors) {
          ex.error.errors.forEach((element: ErrorEvent) => {
            this.message.error(element.message);
            this.carregando = false;
          });
        } else {
          this.message.error(ex.error.message);
          this.carregando = false;
        }
      },
      complete: () => {
        this.carregando = false;
      }
    });
  }

  private carregarPerfis(): void {
    this.carregando = true;
    this.perfilService.findAll().subscribe({
      next: (perfis) => {
        this.perfis = perfis;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      }
    });
  }

  private iniciarForm(): void {
    this.usuarioForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      confirmarSenha: ['', [Validators.required, this.confirmValidator]],
      perfil: ['', Validators.required],
      ativo: [true],
      cargo: ['', Validators.required],
      salario: ['', Validators.required],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      telefone: ['', Validators.required],
      dataNascimento: ['', Validators.required],
    });
  }

  private carregarUsuario(): void {
    this.carregando = true;
    this.usuarioService.findById(this.id).subscribe({
      next: (funcionario) => {
        this.usuarioForm.patchValue({
          email: funcionario.usuario.email,
          senha: '',
          confirmarSenha: '',
          salario: funcionario.salario,
          cargo: funcionario.cargo,
          perfil: funcionario.perfis[0]?.id,
          ativo: funcionario.ativo,
          nome: funcionario.usuario.pessoa.nome,
          cpf: funcionario.usuario.pessoa.cpf,
          telefone: funcionario.usuario.pessoa.telefone,
          dataNascimento: funcionario.usuario.pessoa.dataNascimento,
        });
      },
      complete: () => {
        this.carregando = false;
      }
    });
  }

  confirmValidator = (control: FormGroup): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.usuarioForm.controls['senha'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  verificarSenhasIguais(): void {
    const senhaControl = this.usuarioForm?.get('senha');
    const confirmarSenhaControl = this.usuarioForm?.get('confirmarSenha');

    if (senhaControl && confirmarSenhaControl) {
      const novaSenha = senhaControl.value;
      const confirmarSenha = confirmarSenhaControl.value;

      if (confirmarSenha !== novaSenha) {
        this.message.error('As senhas não são iguais');
      }
    }
  }

  lidarComTeclaPressionada(event: KeyboardEvent): void {
    console.log('Tecla pressionada:', event.key);
  }

  alternarVisibilidadeSenha(): void {
    this.hide = !this.hide;
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}

