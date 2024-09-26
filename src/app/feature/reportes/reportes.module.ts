import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './components/reportes/reportes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormSalariosCotizacionesComponent } from './components/form-salarios-cotizaciones/form-salarios-cotizaciones.component';
import { FormElementosCotizacionesComponent } from './components/form-elementos-cotizaciones/form-elementos-cotizaciones.component';
import { FormTrazabilidadCotizacionesComponent } from './components/form-trazabilidad-cotizaciones/form-trazabilidad-cotizaciones.component';
import { ReportViewerComponent } from './components/report-viewer/report-viewer.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    ReportesComponent,
    FormElementosCotizacionesComponent,
    FormSalariosCotizacionesComponent,
    FormTrazabilidadCotizacionesComponent,
    ReportViewerComponent,
  ],
  imports: [CommonModule, ReportesRoutingModule, SharedModule, PdfViewerModule],
  exports: [
    ReportesComponent,
    FormElementosCotizacionesComponent,
    FormSalariosCotizacionesComponent,
    FormTrazabilidadCotizacionesComponent,
  ],
})
export class ReportesModule {}
