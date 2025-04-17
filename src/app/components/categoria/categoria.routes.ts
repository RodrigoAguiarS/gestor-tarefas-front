import { Routes } from "@angular/router";
import { CategoriaCreateComponent } from "./categoria-create/categoria-create.component";
import { CategoriaListComponent } from "./categoria-list/categoria-list.component";
import { CategoriaUpdateComponent } from "./categoria-update/categoria-update.component";
import { CategoriaDeleteComponent } from "./categoria-delete/categoria-delete.component";



export const categoriaRoutes: Routes = [
  { path: 'create', component: CategoriaCreateComponent },
  { path: 'list', component: CategoriaListComponent },
  { path: 'update/:id', component: CategoriaUpdateComponent },
  { path: 'delete/:id', component: CategoriaDeleteComponent },
];
