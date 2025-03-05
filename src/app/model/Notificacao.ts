import { Usuario } from "./Usuario";

export class Notificacao {
  id!: number;
  titulo!: string;
  mensagem!: string;
  criadoEm!: Date;
  lida!: boolean;
  usuario!: Usuario;

  constructor(id: number, titulo: string, mensagem: string, criadoEm: Date, lida: boolean, usuario: Usuario) {
    this.id = id;
    this.titulo = titulo;
    this.mensagem = mensagem;
    this.criadoEm = criadoEm;
    this.lida = lida;
    this.usuario = usuario;
  }
}
