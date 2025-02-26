import { Routes } from '@angular/router';
import { TarefaCreateComponent } from './tarefa-create/tarefa-create.component';
import { TarefaListComponent } from './tarefa-list/tarefa-list.component';
import { TarefaUpdateComponent } from './tarefa-update/tarefa-update.component';
import { TarefaDeleteComponent } from './tarefa-delete/tarefa-delete.component';
import { UsuarioTarefasComponent } from '../usuario/usuario-tarefas/usuario-tarefas.component';
import { RoleGuard } from '../../auth/role.guard';
import { ACESSO } from '../../model/Acesso';

export const tarefaRoutes: Routes = [
  { path: 'create', component: TarefaCreateComponent, canActivate: [RoleGuard], data: { roles: [ACESSO.ADMINISTRADOR] } },
  { path: 'update/:id', component: TarefaUpdateComponent, canActivate: [RoleGuard], data: { roles: [ACESSO.ADMINISTRADOR] } },
  { path: 'delete/:id', component: TarefaDeleteComponent, canActivate: [RoleGuard], data: { roles: [ACESSO.ADMINISTRADOR] } },
  { path: 'list', component: TarefaListComponent, canActivate: [RoleGuard], data: { roles: [ACESSO.ADMINISTRADOR] } },
  { path: 'usuario/list', component: UsuarioTarefasComponent, canActivate: [RoleGuard], data: { roles: [ACESSO.ADMINISTRADOR, ACESSO.OPERADOR] } },
];
