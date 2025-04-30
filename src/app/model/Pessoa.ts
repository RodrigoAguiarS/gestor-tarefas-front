import { Usuario } from "./Usuario";

export class Pessoa {
  id!: number;
  nome!: string;
  cpf!: string;
  telefone!: string;
  dataNascimento!: Date;
  usuario!: Usuario;
}
