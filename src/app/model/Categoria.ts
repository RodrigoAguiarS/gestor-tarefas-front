export class Categoria {
  id!: number;
  nome!: string;
  descricao!: string ;
  ativo!: boolean;

  constructor(partial?: Partial<Categoria>) {
    Object.assign(this, partial);
  }
}


