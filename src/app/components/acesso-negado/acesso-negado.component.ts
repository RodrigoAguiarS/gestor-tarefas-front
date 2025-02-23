import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-acesso-negado',
  imports: [NzButtonModule, NzResultModule],
  templateUrl: './acesso-negado.component.html',
  styleUrl: './acesso-negado.component.css',
})
export class AcessoNegadoComponent {
  constructor(private readonly roteador: Router) {}

  navegarParaHome(): void {
    this.roteador.navigate(['/home']);
  }
}
