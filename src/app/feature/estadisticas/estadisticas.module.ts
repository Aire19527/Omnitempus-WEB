import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasRoutingModule } from './estadisticas-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TiemposOfertasComponent } from './components/estadisticas/tiempos-ofertas/tiempos-ofertas.component';
import { AprobacionComponent } from './components/estadisticas/aprobacion/aprobacion.component';
import { OfertasAprobadasComponent } from './components/estadisticas/ofertas-aprobadas/ofertas-aprobadas.component';
import { OfertasLineaNegocioComponent } from './components/estadisticas/ofertas-linea-negocio/ofertas-linea-negocio.component';
import { OfertasTipoServicioComponent } from './components/estadisticas/ofertas-tipo-servicio/ofertas-tipo-servicio.component';

@NgModule({
  declarations: [EstadisticasComponent, TiemposOfertasComponent, AprobacionComponent, OfertasAprobadasComponent, OfertasLineaNegocioComponent, OfertasTipoServicioComponent],
  imports: [CommonModule,EstadisticasRoutingModule, SharedModule],
  exports: [EstadisticasComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ]
})
export class EstadisticasModule { }
