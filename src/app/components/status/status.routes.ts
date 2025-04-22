import { Routes } from '@angular/router';
import { StatusCreateComponent } from './status-create/status-create.component';
import { StatusDeleteComponent } from './status-delete/status-delete.component';
import { StatusListComponent } from './status-list/status-list.component';
import { StatusUpdateComponent } from './status-update/status-update.component';

export const statusRoutes: Routes = [
  { path: 'create', component: StatusCreateComponent },
  { path: 'update/:id', component: StatusUpdateComponent },
  { path: 'delete/:id', component: StatusDeleteComponent },
  { path: 'list', component: StatusListComponent },
];
