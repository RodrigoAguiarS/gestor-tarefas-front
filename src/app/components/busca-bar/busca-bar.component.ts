import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CarrinhoComponent } from '../carrinho/carrinho.component';
import { Categoria } from '../../model/Categoria';

@Component({
  selector: 'app-busca-bar',
  imports: [
    FormsModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    CommonModule,
    CarrinhoComponent,
    NzButtonModule,
    NzFormModule,
    NzIconModule,
  ],
  templateUrl: './busca-bar.component.html',
  styleUrls: ['./busca-bar.component.css']
})
export class BuscaBarComponent {
  @Input() categorias: Categoria[] = [];
  @Output() buscaChange = new EventEmitter<string>();
  @Output() categoriaChange = new EventEmitter<string>();

  termoDeBusca: string = '';
  categoriaSelecionada: string = '';

  onBuscaChange(): void {
    this.buscaChange.emit(this.termoDeBusca);
  }

  onCategoriaChange(): void {
    this.categoriaChange.emit(this.categoriaSelecionada);
  }
}
