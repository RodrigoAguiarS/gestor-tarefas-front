import { ACESSO } from './../../model/Acesso';
import { Routes } from '@angular/router';
import { VendaFinalizarComponent } from './venda-finalizar/venda-finalizar.component';
import { RoleGuard } from '../../auth/role.guard';
import { VendaListComponent } from './venda-list/venda-list.component';
import { VendaTimelineComponent } from './venda-timeline/venda-timeline.component';
import { VendaListClienteComponent } from './venda-list-cliente/venda-list-cliente.component';

export const vendaRoutes: Routes = [
  { path: 'finalizar', component: VendaFinalizarComponent, canActivate: [RoleGuard], data: { roles: [ACESSO.CLIENTE, ACESSO.ADMINISTRADOR] } },
  { path: 'timeline/:id', component: VendaTimelineComponent, canActivate: [RoleGuard], data: { roles: [ACESSO.CLIENTE] } },
  { path: 'meus-pedidos', component: VendaListClienteComponent, canActivate: [RoleGuard], data: { roles: [ACESSO.CLIENTE] } },
  { path: 'list', component: VendaListComponent, canActivate: [RoleGuard], data: { roles: [ACESSO.ADMINISTRADOR] } },
];
