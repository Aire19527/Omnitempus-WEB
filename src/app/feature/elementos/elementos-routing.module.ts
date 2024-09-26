import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElementosComponent } from './components/elementos/elementos.component';

const routes: Routes = [
  {
    path: '',
    component: ElementosComponent,
    data: { breadcrumb: 'Compras' },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElementosRoutingModule {}
