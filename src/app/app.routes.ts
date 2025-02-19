import { Routes } from '@angular/router';
import { NoAuthGuard } from './auth/noauth.guard';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RoleGuard } from './auth/role.guard';
import { ACESSO } from './model/Acesso';
import { AuthGuard } from './auth/auth.guard';
import { NavComponent } from './components/nav/nav.component';
import { UsuarioCreateComponent } from './components/usuario/usuario-create/usuario-create.component';
import { UsuarioListComponent } from './components/usuario/usuario-list/usuario-list.component';
import { UsuarioUpdateComponent } from './components/usuario/usuario-update/usuario-update.component';
import { UsuarioDeleteComponent } from './components/usuario/usuario-delete/usuario-delete.component';
import { ResultComponent } from './components/result/result.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  {
    path: '',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.ADMINISTRADOR, ACESSO.OPERADOR] },
      },
      {
        path: 'usuarios',
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.ADMINISTRADOR] },
        children: [
          { path: 'create', component: UsuarioCreateComponent },
          { path: 'update/:id', component: UsuarioUpdateComponent },
          { path: 'delete/:id', component: UsuarioDeleteComponent },
          { path: 'list', component: UsuarioListComponent },
        ],
      },
      {
        path: 'result',
        component: ResultComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];
