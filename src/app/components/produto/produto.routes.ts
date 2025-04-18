import { ProdutoCreateComponent } from './produto-create/produto-create.component';
import { ProdutoDeleteComponent } from './produto-delete/produto-delete.component';
import { ProdutoListComponent } from './produto-list/produto-list.component';
import { ProdutoUpdateComponent } from './produto-update/produto-update.component';

import { Routes } from "@angular/router";

export const produtoRoutes: Routes = [
  { path: 'create', component: ProdutoCreateComponent },
  { path: 'update/:id', component: ProdutoUpdateComponent },
  { path: 'delete/:id', component: ProdutoDeleteComponent },
  { path: 'list', component: ProdutoListComponent },
];
