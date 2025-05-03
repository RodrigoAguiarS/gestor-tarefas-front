import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ClienteService } from '../../../services/cliente.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NgxMaskDirective } from 'ngx-mask';
import { EnderecoResposta } from '../../../model/EnderecoReponse';
import { EnderecoService } from '../../../services/endereco.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cliente-perfil',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NgxMaskDirective,
    NzCardModule,
    NzIconModule,
    NzAvatarModule,
    NzSpinModule,
    NzTabsModule,
    NzDatePickerModule,
  ],
  templateUrl: './cliente-perfil.component.html',
  styleUrl: './cliente-perfil.component.css',
})
export class ClientePerfilComponent {
  constructor(
    private readonly fb: FormBuilder,
    private readonly message: NzMessageService,
    private readonly router: Router,
    private readonly authservice: AuthService,
    private readonly route: ActivatedRoute,
    private readonly enderecoService: EnderecoService,
    private readonly clienteService: ClienteService
  ) {}

  clienteForm!: FormGroup;
  carregando = false;
  hide: boolean = true;
  id!: number;

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      dataNascimento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      rua: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      bairro: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
    this.clienteForm.get('cep')?.valueChanges.subscribe((cep) => {
      if (cep && cep.length === 8) {
        this.buscarCep(cep);
      }
    });
    this.carregarDadosCliente();
  }

  private carregarDadosCliente(): void {
    this.carregando = true;
    this.clienteService.usuarioLogado().subscribe({
      next: (cliente) => {
        this.clienteForm.patchValue({
          nome: cliente.usuario.pessoa.nome,
          cpf: cliente.usuario.pessoa.cpf,
          senha: cliente.usuario.senha,
          dataNascimento: cliente.usuario.pessoa.dataNascimento,
          email: cliente.usuario.email,
          telefone: cliente.usuario.pessoa.telefone,
          cep: cliente.endereco.cep,
          rua: cliente.endereco.rua,
          numero: cliente.endereco.numero,
          bairro: cliente.endereco.bairro,
          cidade: cliente.endereco.cidade,
          estado: cliente.endereco.estado,
        });
      },
      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  atualizarPerfil(): void {
    this.carregando = true;
    if (this.clienteForm.valid) {
      const clienteAtualizado = { ...this.clienteForm.value, id: this.id };

      this.clienteService.update(clienteAtualizado).subscribe({
        next: () => {
          const email = this.clienteForm.get('email')?.value;
          const senha = this.clienteForm.get('senha')?.value;

          if (email && senha) {
            this.authservice.authenticate({ email, senha }).subscribe({
              next: (loginResponse) => {
                const token =
                  loginResponse.headers.get('Authorization')?.substring(7) ?? '';
                this.authservice.successfulLogin(token);
                this.router.navigate(['/produtos/card']);
                this.message.success('Perfil atualizado e login realizado com sucesso!');
              },
              error: () => {
                this.message.error(
                  'Erro ao realizar login automático. Por favor, faça login manualmente.'
                );
                this.carregando = false;
              },
            });
          } else {
            this.message.error(
              'Erro ao obter as credenciais para login automático.'
            );
            this.carregando = false;
          }
        },
        error: (ex) => {
          if (ex.error?.errors) {
            ex.error.errors.forEach((element: { message: string }) => {
              this.message.error(element.message);
            });
          } else {
            this.message.error(
              ex.error?.message ?? 'Erro ao atualizar o perfil.'
            );
          }
          this.carregando = false;
        },
        complete: () => {
          this.carregando = false;
        },
      });
    } else {
      this.message.error('Por favor, preencha todos os campos corretamente.');
    }
  }

  buscarCep(cep: string): void {
    this.enderecoService.buscaEnderecoPorCep(cep).subscribe({
      next: (dadosCep) => {
        if (Object.keys(dadosCep).length === 1 && 'erro' in dadosCep) {
          this.message.error('CEP não encontrado ou inválido.');
        } else {
          this.preencherCamposComCep(dadosCep);
          this.message.success('Endereço encontrado com sucesso');
        }
      },
      error: (ex) => {
        this.message.error(ex);
      },
    });
  }

  preencherCamposComCep(dadosCep: EnderecoResposta): void {
    this.clienteForm.patchValue({
      cep: dadosCep.cep,
      rua: dadosCep.logradouro,
      bairro: dadosCep.bairro,
      cidade: dadosCep.localidade,
      estado: dadosCep.uf,
    });
  }

  cancelar(): void {
    this.clienteForm.reset();
    this.router.navigate(['/produtos/card']);
  }
}
