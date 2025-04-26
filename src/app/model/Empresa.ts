import { Endereco } from "./Endereco";
import { HorarioAtendimento } from "./HorarioFuncionamento";


export class Empresa {
  id!: number;
  nome!: string;
  cnpj!: string;
  endereco!: Endereco;
  telefone!: string;
  horarioAtendimento!: HorarioAtendimento;
}
