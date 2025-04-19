import { Cliente } from "./Cliente";
import { ItemVenda } from "./ItemVenda";
import { Pagamento } from "./Pagamento";
import { Status } from "./Status";

export class Venda {
  id!: number;
  cliente!: Cliente;
  itens!: ItemVenda[];
  status!: Status;
  dataVenda!: Date;
  valorTotal!: number;
  pagamento!: Pagamento;
}
