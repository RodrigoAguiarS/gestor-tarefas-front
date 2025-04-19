import { RoleGuard } from '../../auth/role.guard';
import { ACESSO } from '../../model/Acesso';
import { ProdutoCardComponent } from './produto-card/produto-card.component';
import { ProdutoCreateComponent } from './produto-create/produto-create.component';
import { ProdutoDeleteComponent } from './produto-delete/produto-delete.component';
import { ProdutoListComponent } from './produto-list/produto-list.component';
import { ProdutoUpdateComponent } from './produto-update/produto-update.component';

import { Routes } from '@angular/router';

export const produtoRoutes: Routes = [
  { path: 'create', component: ProdutoCreateComponent, canActivate: [RoleGuard], data: { roles: [ACESSO.ADMINISTRADOR] } },
  { path: 'delete/:id', component: ProdutoDeleteComponent, canActivate: [RoleGuard], data: { roles: [ACESSO.ADMINISTRADOR] } },
  { path: 'list', component: ProdutoListComponent, canActivate: [RoleGuard], data: { roles: [ACESSO.ADMINISTRADOR] } },
  { path: 'update/:id', component: ProdutoUpdateComponent, canActivate: [RoleGuard], data: { roles: [ACESSO.ADMINISTRADOR] } },
  {
    path: 'card', component: ProdutoCardComponent,
    canActivate: [RoleGuard],
    data: { roles: [ACESSO.CLIENTE] },
  },
];
