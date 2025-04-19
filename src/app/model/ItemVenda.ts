
import { Produto } from "./Produto";
import { Venda } from "./Venda";

export class ItemVenda {
  venda!: Venda;
  produto!: Produto;
  quantidade!: number;
  precoUnitario!: number;
  valorTotal!: number;
}
