import { ACESSO } from './../../model/Acesso';
import { Routes } from '@angular/router';
import { ClienteCreateComponent } from './cliente-create/cliente-create.component';
import { ClientePerfilComponent } from './cliente-perfil/cliente-perfil.component';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { AuthGuard } from '../../auth/auth.guard';

export const clienteRoutes: Routes = [
  {
    path: 'create',
    component: ClienteCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: [ACESSO.CLIENTE, ACESSO.ADMINISTRADOR, ACESSO.OPERADOR] },
  },
  {
    path: 'update/:id',
    component: ClientePerfilComponent,
    canActivate: [AuthGuard],
    data: { roles: [ACESSO.ADMINISTRADOR, ACESSO.OPERADOR] },
  },
  {
    path: 'list',
    component: ClienteListComponent,
    canActivate: [AuthGuard],
    data: { roles: [ACESSO.ADMINISTRADOR, ACESSO.OPERADOR] },
  },
];
