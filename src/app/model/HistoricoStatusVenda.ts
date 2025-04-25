import { Status } from "./Status";
import { Venda } from "./Venda";

export class HistoricoStatusVenda {
  id!: number;
  status!: Status;
  criadoEm!: Date;
  atualizadaEm!: Date;
  observacao!: string;
  venda!: Venda;
}
