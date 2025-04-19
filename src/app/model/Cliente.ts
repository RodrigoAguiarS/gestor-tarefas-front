import { Endereco } from "./Endereco";
import { Usuario } from "./Usuario";

export class  Cliente {
  id!: number;
  usuario!: Usuario;
  endereco!: Endereco;
}
