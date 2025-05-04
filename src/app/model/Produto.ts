import { Categoria } from "./Categoria";


export class Produto {
  readonly id!: number;
  nome!: string;
  preco!: number;
  descricao!: string;
  arquivosUrl: string[] = [];
  categoria!: Categoria;
  quantidade: number = 0;
  quantidadeMinima: number = 0;
  codigoBarras!: string;
  ativo: boolean = true;

  constructor(partial?: Partial<Produto>) {
    Object.assign(this, partial);
  }
}
