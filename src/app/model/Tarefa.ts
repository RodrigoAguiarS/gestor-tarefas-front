import { Prioridade } from "./Prioridade";
import { Situacao } from "./Situacao";
import { Usuario } from "./Usuario";

export class Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  responsavel: Usuario;
  prioridade: Prioridade;
  deadline: Date;
  criadoEm: Date;
  arquivosUrl: string[];
  situacao: Situacao;

  constructor(
    id: number,
    titulo: string,
    descricao: string,
    responsavel: Usuario,
    prioridade: Prioridade,
    arquivosUrl: string[],
    deadline: Date,
    criadoEm: Date,
    situacao: Situacao
  ) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.responsavel = responsavel;
    this.prioridade = prioridade;
    this.arquivosUrl = arquivosUrl;
    this.criadoEm = criadoEm;
    this.deadline = deadline;
    this.situacao = situacao;
  }
}
