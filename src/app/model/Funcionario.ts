import { Empresa } from './Empresa';
import { Perfil } from './Perfil';
import { Usuario } from './Usuario';

export class Funcionario {
  id!: number;
  usuario!: Usuario;
  matricula!: string;
  salario!: Empresa;
  cargo!: string;
  perfis!: Perfil[];
  ativo!: boolean;
}
