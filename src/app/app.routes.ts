import { AdministracaoComponent } from './components/administracao/administracao.component';
import { Routes } from '@angular/router';
import { NoAuthGuard } from './auth/noauth.guard';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RoleGuard } from './auth/role.guard';
import { ACESSO } from './model/Acesso';
import { AuthGuard } from './auth/auth.guard';
import { NavComponent } from './components/nav/nav.component';
import { ResultComponent } from './components/result/result.component';
import { AcessoNegadoComponent } from './components/acesso-negado/acesso-negado.component';
import { NotificacaoListComponent } from './components/notificacao/notificacao-list/notificacao-list.component';
import { ClienteCreateComponent } from './components/cliente/cliente-create/cliente-create.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'cliente-create',  component: ClienteCreateComponent },
  {
    path: '',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.ADMINISTRADOR, ACESSO.OPERADOR] },
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./components/usuario/usuario.routes').then(
            (m) => m.usuarioRoutes
          ),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.ADMINISTRADOR] },
      },
      {
        path: 'pagamentos',
        loadChildren: () =>
          import('./components/pagamento/pagamento.routes').then(
            (m) => m.pagamentoRoutes
          ),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.ADMINISTRADOR] },
      },
      {
        path: 'perfis',
        loadChildren: () =>
          import('./components/perfil/perfil.routes').then(
            (m) => m.perfilRoutes
          ),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.ADMINISTRADOR] },
      },
      {
        path: 'status',
        loadChildren: () =>
          import('./components/status/status.routes').then(
            (m) => m.statusRoutes
          ),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.ADMINISTRADOR] },
      },
      {
        path: 'categorias',
        loadChildren: () =>
          import('./components/categoria/categoria.routes').then(
            (m) => m.categoriaRoutes
          ),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.ADMINISTRADOR] },
      },
      {
        path: 'produtos',
        loadChildren: () =>
          import('./components/produto/produto.routes').then(
            (m) => m.produtoRoutes
          ),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.ADMINISTRADOR, ACESSO.CLIENTE] },
      },
      {
        path: 'tarefas',
        loadChildren: () =>
          import('./components/tarefa/tarefa.routes').then(
            (m) => m.tarefaRoutes
          ),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.ADMINISTRADOR, ACESSO.OPERADOR] },
      },
      {
        path: 'result',
        component: ResultComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'administrativo',
        component: AdministracaoComponent,
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.ADMINISTRADOR] },
      },
      {
        path: 'notificacao',
        component: NotificacaoListComponent,
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.ADMINISTRADOR, ACESSO.OPERADOR] },
      },
      {
        path: 'acesso-negado',
        component: AcessoNegadoComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
