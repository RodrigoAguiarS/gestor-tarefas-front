import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { VendaService } from '../../../services/venda.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Venda } from '../../../model/Venda';
import { Status } from '../../../model/Status';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { UsuarioChangeService } from '../../../services/usuario-change.service';

@Component({
  selector: 'app-status-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzDescriptionsModule,
    NzTableModule,
    NzPaginationModule,
    NzStatisticModule,
    NzSelectModule,
    NzButtonModule,
    NzFormModule,
  ],
  templateUrl: './status-modal.component.html',
  styleUrl: './status-modal.component.css'
})
export class StatusModalComponent {

  carregando = false;

  @Input() venda!: Venda;
  @Input() statusPossiveis!: Status[];
  form: FormGroup;

  ngOnInit(): void {
    console.log('Venda recebida:', this.venda);
    console.log('Status possíveis recebidos:', this.statusPossiveis);
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalRef,
    private readonly userChangeService: UsuarioChangeService,
    private readonly vendaService: VendaService
  ) {
    this.form = this.fb.group({
      status: ['', Validators.required]
    });
  }

  alterarStatus() {
    const statusId = this.form.get('status')?.value;
    this.carregando = true;
    this.vendaService.atualizarStatus(
      this.venda.id,
      statusId,
      this.venda.tipoVenda
    ).subscribe({
      next: () => {
        this.modal.close(true);
      },
      complete: () => {
        this.carregando = false;
        this.userChangeService.notifyUserChanged();
      },
      error: (erro) => {
        console.error('Erro ao alterar status', erro);
      }
    });
  }

  cancelar() {
    this.modal.close();
  }
}
