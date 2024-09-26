import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './components/roles/roles.component';
import { CrearEditarRolComponent } from './components/crear-editar-rol/crear-editar-rol.component';

const routes: Routes = [{
    path: '',
    component: RolesComponent
}, {
  path: 'crear-editar',
  component: CrearEditarRolComponent
}]


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
