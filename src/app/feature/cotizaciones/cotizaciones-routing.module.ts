import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CotizacionesComponent } from './components/cotizaciones/cotizaciones.component';
import { SteppersComponent } from './components/steppers/steppers.component';

const routes: Routes = [
  {
    path: '',
    component: CotizacionesComponent,
    data: { breadcrumb: 'Cotizaciones' },
    children: [
      {
        path: 'crear',
        component: SteppersComponent,
        data: { breadcrumb: 'Crear' },
      },
      {
        path: 'editar',
        component: SteppersComponent,
        data: { breadcrumb: 'Editar' },
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CotizacionesRoutingModule {}
