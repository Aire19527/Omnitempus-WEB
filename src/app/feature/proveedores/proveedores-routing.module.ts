import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { CrearProveedoresComponent } from './components/crear-proveedores/crear-proveedores.component';
import { IncrementoArchivoComponent } from './components/incremento-archivo/incremento-archivo.component';

const routes: Routes = [
  {
    path: '',
    component: ProveedoresComponent,
    data: { breadcrumb: 'Gestión de proveedores' },
    children: [
      {
        path: 'crear',
        component: CrearProveedoresComponent,
        data: { breadcrumb: 'Crear' },
      },
      {
        path: 'editar',
        component: CrearProveedoresComponent,
        data: { breadcrumb: 'Editar' },
      },
    ],
  },
  // {
  //   path: 'incremento',
  //   component: IncrementoArchivoComponent,
  //   data: { breadcrumb: 'Incremento por archivo' },
  // }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProveedoresRoutingModule { }
