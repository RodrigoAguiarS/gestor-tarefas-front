import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ClienteService } from '../../../services/cliente.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgxMaskDirective } from 'ngx-mask';
import { EnderecoResposta } from '../../../model/EnderecoReponse';
import { EnderecoService } from '../../../services/endereco.service';

@Component({
  selector: 'app-cliente-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    NgxMaskDirective,
    NzSpinModule,
    NzTabsModule,
    NzDatePickerModule,
  ],
  templateUrl: './cliente-create.component.html',
  styleUrl: './cliente-create.component.css',
})
export class ClienteCreateComponent {
  currentTabIndex = 0;
  currentStep = 0;
  clienteForm!: FormGroup;
  hide: boolean = true;
  carregando = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly clienteService: ClienteService,
    private readonly enderecoService: EnderecoService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.iniciarForm();
  }

  criar(): void {
    this.carregando = true;
    this.clienteService.create(this.clienteForm.value).subscribe({
      next: (resposta) => {
        this.router.navigate(['/result'], {
          queryParams: {
            type: 'success',
            title: 'Cliente de nome - ' + resposta.usuario.pessoa.nome,
            description: 'O cliente foi criado com sucesso!',
            message: 'O cliente foi criado com sucesso!',
            icon: 'check-circle',
            createRoute: '/clientes/create',
            listRoute: '/clientes/list',
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

  private iniciarForm(): void {
    this.clienteForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      confirmarSenha: ['', [Validators.required, this.confirmValidator]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]],
      rua: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      bairro: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      cep: ['', [Validators.required]],
    });
    this.clienteForm.get('cep')?.valueChanges.subscribe((cep) => {
      if (cep && cep.length === 8) {
        this.buscarCep(cep);
      }
    });
  }

  confirmValidator = (control: FormGroup): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.clienteForm.controls['senha'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  verificarSenhasIguais(): void {
    const senhaControl = this.clienteForm?.get('senha');
    const confirmarSenhaControl = this.clienteForm?.get('confirmarSenha');

    if (senhaControl && confirmarSenhaControl) {
      const novaSenha = senhaControl.value;
      const confirmarSenha = confirmarSenhaControl.value;

      if (confirmarSenha !== novaSenha) {
        this.message.error('As senhas não são iguais');
      }
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
        this.message.error('Erro ao buscar o endereço. Tente novamente.');
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
    this.router.navigate(['/home']);
    this.clienteForm.reset();
  }
}
