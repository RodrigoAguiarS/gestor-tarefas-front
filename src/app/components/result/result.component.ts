import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-result',
  imports: [NzButtonModule, NzResultModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  tipoResultado: 'success' | 'error' = 'success';
  tituloResultado: string = '';
  mensagemResultado: string = '';
  rotaCriacao: string = '';

  constructor(private readonly rota: ActivatedRoute, private readonly roteador: Router) {
    this.rota.queryParams.subscribe(params => {
      this.tipoResultado = params['type'] || 'success';
      this.tituloResultado = params['title'] || '';
      this.mensagemResultado = params['message'] || '';
      this.rotaCriacao = params['createRoute'] || '';
    });
  }

  navegarParaCriar(): void {
    if (this.rotaCriacao) {
      this.roteador.navigate([this.rotaCriacao]);
    }
  }

  navegarParaHome(): void {
    this.roteador.navigate(['/home']);
  }
}
