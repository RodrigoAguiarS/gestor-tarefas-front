import { ItemVenda } from "./ItemVenda";
import { Pagamento } from "./Pagamento";
import { Status } from "./Status";
import { ClienteRetorno } from "./ClienteRetorno";

export class Venda {
  id!: number;
  cliente!: ClienteRetorno;
  itens!: ItemVenda[];
  status!: Status;
  tipoVenda!: string;
  observacao!: string;
  dataVenda!: Date;
  valorTotal!: number;
  pagamento!: Pagamento;
}
