import { Usuario } from "./Usuario";

export interface UsuarioComTarefasConcluidas {
  usuario: Usuario;
  quantidadeTarefasConcluidas: number;
  quantidadeTarefasPendentes: number;
  quantidadeTarefasEmAndamento: number;
}
