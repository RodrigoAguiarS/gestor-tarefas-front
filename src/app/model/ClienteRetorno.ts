import { Endereco } from "./Endereco";
import { Usuario } from "./Usuario";

export class  ClienteRetorno {
  id!: number;
  usuario!: Usuario;
  endereco!: Endereco;
}
