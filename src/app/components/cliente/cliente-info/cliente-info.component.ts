import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzCardComponent } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-cliente-info',
  imports: [NzCardComponent, CommonModule],
  templateUrl: './cliente-info.component.html',
  styleUrl: './cliente-info.component.css',
})
export class ClienteInfoComponent {
  @Input() clienteForm!: FormGroup;

  get clienteInfo() {
    return [
      { label: 'Nome', value: this.clienteForm?.get('nome')?.value },
      { label: 'E-mail', value: this.clienteForm?.get('email')?.value },
      { label: 'Telefone', value: this.formatarTelefone(this.clienteForm?.get('telefone')?.value) },
      { label: 'CPF', value: this.formatarCPF(this.clienteForm?.get('cpf')?.value) },
      { label: 'Data de Nascimento', value: this.formatarData(this.clienteForm?.get('dataNascimento')?.value) },
      {
        label: 'Endereço',
        value: this.formatarEndereco(
          this.clienteForm?.get('rua')?.value,
          this.clienteForm?.get('numero')?.value,
          this.clienteForm?.get('bairro')?.value,
          this.clienteForm?.get('cidade')?.value,
          this.clienteForm?.get('estado')?.value,
          this.clienteForm?.get('cep')?.value
        ),
      },
    ];
  }

  private formatarCPF(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private formatarData(data: string): string {
    if (!data) return '';
    const dataObj = new Date(data);
    return isNaN(dataObj.getTime()) ? '' : dataObj.toLocaleDateString('pt-BR');
  }

  private formatarCEP(cep: string): string {
    if (!cep) return '';
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  private formatarTelefone(telefone: string): string {
    if (!telefone) return '';
    return telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  }

  private formatarEndereco(
    rua: string,
    numero: string,
    bairro: string,
    cidade: string,
    estado: string,
    cep: string
  ): string {
    if (!rua || !numero || !cidade || !estado || !cep) return '';
    return `${rua}, ${numero} ${bairro ? bairro + ',' : ''} ${cidade}/${estado} ${this.formatarCEP(cep)}`;
  }
}
