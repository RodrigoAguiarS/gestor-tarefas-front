import { ClienteRetorno } from "./ClienteRetorno";
import { ItemVenda } from "./ItemVenda";
import { Pagamento } from "./Pagamento";
import { Status } from "./Status";

export class Venda {
  id!: number;
  cliente!: ClienteRetorno;
  itens!: ItemVenda[];
  status!: Status;
  tipoVenda!: string;
  dataVenda!: Date;
  valorTotal!: number;
  pagamento!: Pagamento;
}
