import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesComponent } from './components/reportes/reportes.component';
import { ReportViewerComponent } from './components/report-viewer/report-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: ReportesComponent,
    data: { breadcrumb: 'Reportes' },
  },
  {
    path: 'report-viewer',
    component: ReportViewerComponent,
    data: { breadcrumb: 'Visor Reportes' },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesRoutingModule {}
