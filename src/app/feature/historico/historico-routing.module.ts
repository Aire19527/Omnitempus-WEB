import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoricoComponent } from './components/historico/historico.component';

const routes: Routes = [
  {
    path: '',
    component: HistoricoComponent,
    data: { breadcrumb: 'Histórico de acciones' },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricoRoutingModule { }
