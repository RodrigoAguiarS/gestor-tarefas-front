import { Routes } from '@angular/router';
import { PagamentoCreateComponent } from './pagamento-create/pagamento-create.component';
import { PagamentoListComponent } from './pagamento-list/pagamento-list.component';
import { PagamentoUpdateComponent } from './pagamento-update/pagamento-update.component';
import { PagamentoDeleteComponent } from './pagamento-delete/pagamento-delete.component';

export const pagamentoRoutes: Routes = [
  { path: 'create', component: PagamentoCreateComponent },
  { path: 'update/:id', component: PagamentoUpdateComponent },
  { path: 'delete/:id', component: PagamentoDeleteComponent },
  { path: 'list', component: PagamentoListComponent },
];
