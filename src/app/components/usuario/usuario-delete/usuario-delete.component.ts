import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Perfil } from '../../../model/Perfil';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PerfilService } from '../../../services/perfil.service';
import { UsuarioService } from '../../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-usuario-delete',
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
      ],
  templateUrl: './usuario-delete.component.html',
  styleUrl: './usuario-delete.component.css',
})
export class UsuarioDeleteComponent {
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

  delete(): void {
    this.carregando = true;
    this.usuarioForm.value.id = this.id;
    this.usuarioService.delete(this.usuarioForm.value.id).subscribe({
      next: () => {
        this.message.success('Usuário apagado com sucesso.');
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title:
              'Usuário apagado com sucesso!',
            message: 'O usuário foi apagado com sucesso!',
            createRoute: '/usuarios/create',
            listRoute: '/usuarios/list',
          },
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
        this.carregando = false;
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
      confirmarSenha: ['', [Validators.required]],
      perfil: ['', Validators.required],
      ativo: [true],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      telefone: ['', Validators.required],
      dataNascimento: ['', Validators.required],
    });
  }

  private carregarUsuario(): void {
    this.carregando = true;
    this.usuarioService.findById(this.id).subscribe({
      next: (usuario) => {
        console.log(' aquiUsuario:', usuario);
        this.usuarioForm.patchValue({
          email: usuario.email,
          senha: '',
          confirmarSenha: '',
          perfil: usuario.perfis[0]?.id,
          ativo: usuario.ativo,
          nome: usuario.pessoa.nome,
          cpf: usuario.pessoa.cpf,
          telefone: usuario.pessoa.telefone,
          dataNascimento: usuario.pessoa.dataNascimento,
        });
        this.usuarioForm.disable();
      },
      complete: () => {
        this.carregando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
