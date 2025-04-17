import { Routes } from "@angular/router";
import { CategoriaCreateComponent } from "./categoria-create/categoria-create.component";
import { CategoriaListComponent } from "./categoria-list/categoria-list.component";



export const categoriaRoutes: Routes = [
  { path: 'create', component: CategoriaCreateComponent },
  { path: 'list', component: CategoriaListComponent },
];
