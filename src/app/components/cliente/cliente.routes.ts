import { Routes } from '@angular/router';
import { ClienteCreateComponent } from './cliente-create/cliente-create.component';
import { ClientePerfilComponent } from './cliente-perfil/cliente-perfil.component';


export const clienteRoutes: Routes = [
  { path: 'create', component: ClienteCreateComponent },
  { path: 'update/:id', component: ClientePerfilComponent },
];
