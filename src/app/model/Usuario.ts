import { Perfil } from './Perfil';
import { Pessoa } from './Pessoa';

export class Usuario {
  id!: number;
  pessoa: Pessoa = new Pessoa();
  email!: string;
  senha!: string;
  perfis!: Perfil[];
  ativo!: boolean;
}
