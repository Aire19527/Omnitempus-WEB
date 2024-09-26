import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';

const routes: Routes = [
  {
    path: '',
    component: EstadisticasComponent,
    data: { breadcrumb: 'Estadísticas' },
  },
];



@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadisticasRoutingModule { }
