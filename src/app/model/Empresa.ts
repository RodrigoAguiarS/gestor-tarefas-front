import { Endereco } from "./Endereco";
import { HorarioFuncionamento } from "./HorarioFuncionamento";


export class Empresa {
  id!: number;
  nome!: string;
  cnpj!: string;
  endereco!: Endereco;
  telefone!: string;
  horariosFuncionamento!: HorarioFuncionamento[];
}
