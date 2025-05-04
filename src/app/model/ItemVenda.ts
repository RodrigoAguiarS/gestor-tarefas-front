
import { Produto } from "./Produto";
import { Venda } from "./Venda";

export class ItemVenda {
  venda!: Venda;
  produto!: Produto;
  quantidade!: number;
  observacao!: string;
  precoUnitario!: number;
  valorTotal!: number;
}
