import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClienteComponent } from './components/cliente/cliente.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClienteCrearEditarComponent } from './components/cliente-crear-editar/cliente-crear-editar.component';

@NgModule({
  declarations: [ClienteComponent, ClienteCrearEditarComponent],
  imports: [CommonModule, ClientesRoutingModule, SharedModule],
})
export class ClientesModule {}
