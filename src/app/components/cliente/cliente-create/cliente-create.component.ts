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
import { AuthService } from '../../../services/auth.service';
import { EnderecoResposta } from '../../../model/EnderecoReponse';
import { EnderecoService } from '../../../services/endereco.service';
import { ClienteInfoComponent } from '../cliente-info/cliente-info.component';

@Component({
  selector: 'app-cliente-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    ClienteInfoComponent,
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
    private readonly authservice: AuthService,
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
            ex.error?.message ?? 'Erro ao cadastrar o cliente.'
          );
        }
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
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

  nextTab(): void {
    this.currentTabIndex++;
  }

   voltarTelaDeLogin(): void {
    this.router.navigate(['/login']);
  }

  previousTab(): void {
    this.currentTabIndex--;
  }

  onTabChange(index: number): void {
    this.currentTabIndex = index;

    setTimeout(() => {
      const activeTab = document.querySelector(
        `#nz-tabs-${index}-tab-${index}`
      );
      if (activeTab) {
        const focusableElement = activeTab.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        (focusableElement as HTMLElement)?.focus();
      }
    }, 0);
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
    this.clienteForm.reset();
    this.currentTabIndex = 0;
  }

  nextStep(): void {
    this.currentStep++;
  }

  previousStep(): void {
    this.currentStep--;
  }
}
