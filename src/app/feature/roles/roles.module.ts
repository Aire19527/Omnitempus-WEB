import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './components/roles/roles.component';
import { CrearEditarRolComponent } from './components/crear-editar-rol/crear-editar-rol.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RolesComponent, CrearEditarRolComponent],
  imports: [CommonModule, RolesRoutingModule, SharedModule],
})
export class RolesModule {}
