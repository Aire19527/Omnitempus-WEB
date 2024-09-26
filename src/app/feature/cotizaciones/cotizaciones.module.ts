import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CotizacionesRoutingModule } from './cotizaciones-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CotizacionesComponent } from './components/cotizaciones/cotizaciones.component';
import { AgregarElementoComponent } from './components/agregar-elemento/agregar-elemento.component';
import { AreaCostosComponent } from './components/area-costos/area-costos.component';
import { AgregarPolizaComponent } from './components/agregar-poliza/agregar-poliza.component';
import { ClasificacionesComponent } from './components/puestos/clasificaciones/clasificaciones.component';
import { PuestosComponent } from './components/puestos/puestos.component';
import { SteppersComponent } from './components/steppers/steppers.component';
import { SalarioComponent } from './components/puestos/clasificaciones/salario/salario.component';
import { CrearEditarComponent } from './components/puestos/clasificaciones/salario/crear-editar/crear-editar.component';
import { PrestacionesSocialesLegalesComponent } from './components/puestos/clasificaciones/prestaciones-sociales-legales/prestaciones-sociales-legales.component';
import { EditarARLComponent } from './components/puestos/clasificaciones/prestaciones-sociales-legales/editar-arl/editar-arl.component';
import { TiposElementosComponent } from './components/puestos/clasificaciones/tipos-elementos/tipos-elementos.component';
import { ElementosComponent } from './components/puestos/clasificaciones/tipos-elementos/elementos/elementos.component';
import { CrearEditarElementosComponent } from './components/puestos/clasificaciones/tipos-elementos/elementos/crear-editar-elementos/crear-editar-elementos.component';
import { PropuestaEconomicaComponent } from './components/propuesta-economica/propuesta-economica.component';
import { BonosOTComponent } from './components/puestos/clasificaciones/bonos-ot/bonos-ot.component';
import { CrearEditarBonoOTComponent } from './components/puestos/clasificaciones/bonos-ot/crear-editar-bono-ot/crear-editar-bono-ot.component';
import { AgregarNotaComponent } from './components/propuesta-economica/agregar-nota/agregar-nota.component';
import { TurnoComponent } from './components/puestos/clasificaciones/turno/turno.component';
import { SeleccionarTurnoComponent } from './components/puestos/clasificaciones/turno/seleccionar-turno/seleccionar-turno.component';
import { HorasExtrasComponent } from './components/puestos/clasificaciones/horas-extras/horas-extras.component';
import { VerEsquemaComponent } from './components/puestos/clasificaciones/turno/ver-esquema/ver-esquema.component';
import { CatalogosModule } from '../catalogos/catalogos.module';
import { CambiarEstadoComponent } from './components/puestos/cambiar-estado/cambiar-estado.component';
import { CalcularCostosComponent } from './components/puestos/clasificaciones/calcular-costos/calcular-costos.component';
import { EscoltaPersonasComponent } from './components/puestos/clasificaciones/calcular-costos/escolta-personas/escolta-personas.component';
import { ImpuestoMargenesComponent } from './components/puestos/clasificaciones/calcular-costos/impuesto-margenes/impuesto-margenes.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HistoricoEstadoComponent } from './components/puestos/historico-estado/historico-estado.component';
import { NotificacionComponent } from './components/notificacion/notificacion.component';

@NgModule({
  declarations: [
    CotizacionesComponent,
    AgregarElementoComponent,
    AreaCostosComponent,
    AgregarPolizaComponent,
    ClasificacionesComponent,
    PuestosComponent,
    SteppersComponent,
    SalarioComponent,
    CrearEditarComponent,
    PrestacionesSocialesLegalesComponent,
    EditarARLComponent,
    TiposElementosComponent,
    ElementosComponent,
    CrearEditarElementosComponent,
    PropuestaEconomicaComponent,
    BonosOTComponent,
    CrearEditarBonoOTComponent,
    AgregarNotaComponent,
    TurnoComponent,
    SeleccionarTurnoComponent,
    HorasExtrasComponent,
    VerEsquemaComponent,
    CambiarEstadoComponent,
    CalcularCostosComponent,
    EscoltaPersonasComponent,
    ImpuestoMargenesComponent,
    HistoricoEstadoComponent,
    NotificacionComponent,
  ],
  imports: [
    CommonModule,
    CotizacionesRoutingModule,
    SharedModule,
    CatalogosModule,
  ],
  exports: [
    CotizacionesComponent,
    AgregarElementoComponent,
    AreaCostosComponent,
  ],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
})
export class CotizacionesModule {}
