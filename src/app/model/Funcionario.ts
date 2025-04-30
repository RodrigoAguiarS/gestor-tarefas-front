import { Empresa } from './Empresa';
import { Perfil } from './Perfil';

export class Funcionario {
  id!: number;
  nome!: string;
  cpf!: string;
  cargo!: string;
  dataNascimento!: Date;
  telefone!: string;
  email!: string;
  matricula!: string;
  salario!: Empresa;
  perfis!: Perfil[];
  ativo!: boolean;
}
