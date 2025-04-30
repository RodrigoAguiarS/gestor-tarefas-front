import { Endereco } from "./Endereco";
import { Pessoa } from "./Pessoa";

export class  Cliente {
  id!: number;
  pessoa!: Pessoa;
  endereco!: Endereco;
}
