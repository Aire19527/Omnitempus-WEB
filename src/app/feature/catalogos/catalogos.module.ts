import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogosRoutingModule } from './catalogos-routing.module';
import { MenuCatalogoComponent } from './menu-catalogo.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CrearCargoComponent } from './cargos/components/crear-cargo/crear-cargo.component';
import { CargoComponent } from './cargos/components/cargo/cargo.component';
import { CatalogoElementoComponent } from './elementos/components/elemento/elemento.component';
import { ElementoCrearEditarComponent } from './elementos/components/elemento-crear-editar/elemento-crear-editar.component';
import { ParametrosGenComponent } from './parametros-gen/components/parametros-gen/parametros-gen.component';
import { CrearParametrosGenComponent } from './parametros-gen/components/crear-parametros-gen/crear-parametros-gen.component';
import { TurnosComponent } from './turnos/components/turnos/turnos.component';
import { FormTurnosComponent } from './turnos/components/form-turnos/form-turnos.component';
import { HorariosComponent } from './turnos/components/horarios/horarios.component';
import { FormHorariosComponent } from './turnos/components/form-horarios/form-horarios.component';
import { RiesgosArlComponent } from './riesgos-arl/components/riesgos-arl/riesgos-arl.component';
import { FormRiesgosArlComponent } from './riesgos-arl/components/form-riesgos-arl/form-riesgos-arl.component';
import { LineasNegocioComponent } from './lineas-negocio/components/lineas-negocio/lineas-negocio.component';
import { FormLineasNegocioComponent } from './lineas-negocio/components/form-lineas-negocio/form-lineas-negocio.component';
import { AreasComponent } from './areas/components/areas/areas.component';
import { AreasCrearEditComponent } from './areas/components/areas-crear-edit/areas-crear-edit.component';
import { SubcargosComponent } from './subcargos/components/subcargos/subcargos.component';
import { FormSubcargosComponent } from './subcargos/components/form-subcargos/form-subcargos.component';
import { ElementosSubCargosComponent } from './subcargos/components/elementos/elementos.component';
import { FormElementosComponent } from './subcargos/components/form-elementos/form-elementos.component';
import { EsquemaComponent } from './turnos/components/esquema/esquema.component';
import { FormEsquemaSemanaComponent } from './turnos/components/form-esquema-semana/form-esquema-semana.component';
import { FormEsquemaHorasComponent } from './turnos/components/form-esquema-horas/form-esquema-horas.component';
import { FormEsquemaHorarioTrabajoComponent } from './turnos/components/form-esquema-horario-trabajo/form-esquema-horario-trabajo.component';
import { TipoSalarioComponent } from './tipos-salarios/components/tipo-salario/tipo-salario.component';
import { FormTipoSalarioComponent } from './tipos-salarios/components/form-tipo-salario/form-tipo-salario.component';
import { HorasTrabajoComponent } from './horas-trabajo/components/horas-trabajo/horas-trabajo.component';
import { FormHorasTrabajoComponent } from './horas-trabajo/components/form-horas-trabajo/form-horas-trabajo.component';
import { ConceptoBaseSalarialComponent } from './concepto-base-salarial/components/concepto-base-salarial/concepto-base-salarial.component';
import { ConceptoBaseSalarialCrearEditarComponent } from './concepto-base-salarial/components/concepto-base-salarial-crear-editar/concepto-base-salarial-crear-editar.component';
import { TextoCotizacionComponent } from './texto-cotizacion/components/texto-cotizacion/texto-cotizacion.component';
import { TextoCotizacionCrearEditarComponent } from './texto-cotizacion/components/texto-cotizacion-crear-editar/texto-cotizacion-crear-editar.component';
import { CalendarioComponent } from './calendario/components/calendario/calendario.component';
import { FormCalendarioComponent } from './calendario/components/form-calendario/form-calendario.component';
import { PolizasComponent } from './polizas/components/polizas/polizas.component';
import { PolizasCrearEditarComponent } from './polizas/components/polizas-crear-editar/polizas-crear-editar.component';
import { PersonasComponent } from './turnos/components/personas/personas.component';
import { TableHorarioPersonaComponent } from './turnos/components/table-horario-persona/table-horario-persona.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AreasPermisosComponent } from './areas/components/areas-permisos/areas-permisos.component';
import { MenusAreaComponent } from './areas/components/menus-area/menus-area.component';
import { FormNotificacionesComponent } from './notificaciones/components/form-notificaciones/form-notificaciones.component';
import { CorreosComponent } from './notificaciones/components/correos/correos.component';
import { FormCorreosComponent } from './notificaciones/components/form-correos/form-correos.component';
import { NotificacionesComponent } from './notificaciones/components/notificaciones/notificaciones.component';

@NgModule({
  declarations: [
    MenuCatalogoComponent,
    CargoComponent,
    CrearCargoComponent,
    CatalogoElementoComponent,
    ElementoCrearEditarComponent,
    ParametrosGenComponent,
    CrearParametrosGenComponent,
    TurnosComponent,
    FormTurnosComponent,
    HorariosComponent,
    FormHorariosComponent,
    FormEsquemaSemanaComponent,
    FormEsquemaHorasComponent,
    EsquemaComponent,
    FormEsquemaHorarioTrabajoComponent,
    RiesgosArlComponent,
    FormRiesgosArlComponent,
    LineasNegocioComponent,
    FormLineasNegocioComponent,
    AreasComponent,
    AreasCrearEditComponent,
    SubcargosComponent,
    FormSubcargosComponent,
    ElementosSubCargosComponent,
    FormElementosComponent,
    TipoSalarioComponent,
    FormTipoSalarioComponent,
    HorasTrabajoComponent,
    FormHorasTrabajoComponent,
    PersonasComponent,
    ConceptoBaseSalarialComponent,
    ConceptoBaseSalarialCrearEditarComponent,
    TextoCotizacionComponent,
    TextoCotizacionCrearEditarComponent,
    CalendarioComponent,
    FormCalendarioComponent,
    PolizasComponent,
    PolizasCrearEditarComponent,
    PersonasComponent,
    TableHorarioPersonaComponent,
    AreasPermisosComponent,
    MenusAreaComponent,
    NotificacionesComponent,
    FormNotificacionesComponent,
    CorreosComponent,
    FormCorreosComponent,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es' }],
  imports: [
    CommonModule,
    CatalogosRoutingModule,
    SharedModule,
    MatPaginatorModule,
  ],
  exports: [
    MenuCatalogoComponent,
    CargoComponent,
    CrearCargoComponent,
    CatalogoElementoComponent,
    ElementoCrearEditarComponent,
    ParametrosGenComponent,
    CrearParametrosGenComponent,
    TurnosComponent,
    FormTurnosComponent,
    HorariosComponent,
    FormHorariosComponent,
    FormEsquemaSemanaComponent,
    FormEsquemaHorasComponent,
    EsquemaComponent,
    FormEsquemaHorarioTrabajoComponent,
    PersonasComponent,
    RiesgosArlComponent,
    FormRiesgosArlComponent,
    LineasNegocioComponent,
    FormLineasNegocioComponent,
    AreasComponent,
    AreasCrearEditComponent,
    SubcargosComponent,
    FormSubcargosComponent,
    ElementosSubCargosComponent,
    FormElementosComponent,
    TipoSalarioComponent,
    FormTipoSalarioComponent,
    HorasTrabajoComponent,
    FormHorasTrabajoComponent,
    CalendarioComponent,
    FormCalendarioComponent,
    TableHorarioPersonaComponent,
    NotificacionesComponent,
    FormNotificacionesComponent,
    CorreosComponent,
    FormCorreosComponent,
  ],
})
export class CatalogosModule {}
