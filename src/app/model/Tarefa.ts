import { Prioridade } from "./Prioridade";
import { Situacao } from "./Situacao";
import { Usuario } from "./Usuario";

export class Tarefa {
  id?: number;
  titulo: string;
  descricao: string;
  responsavel: Usuario;
  prioridade: Prioridade;
  deadline: Date;
  situacao: Situacao;

  constructor(
    titulo: string,
    descricao: string,
    responsavel: Usuario,
    prioridade: Prioridade,
    deadline: Date,
    situacao: Situacao
  ) {
    this.titulo = titulo;
    this.descricao = descricao;
    this.responsavel = responsavel;
    this.prioridade = prioridade;
    this.deadline = deadline;
    this.situacao = situacao;
  }
}
