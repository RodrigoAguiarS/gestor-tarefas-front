import { Empresa } from './Empresa';
import { Perfil } from './Perfil';
import { Pessoa } from './Pessoa';

export class Usuario {
  id!: number;
  pessoa: Pessoa = new Pessoa();
  email!: string;
  senha!: string;
  empresa!: Empresa;
  perfis!: Perfil[];
  ativo!: boolean;
}
