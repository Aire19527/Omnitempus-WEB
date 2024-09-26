import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuCatalogoComponent } from './menu-catalogo.component';
import { CargoComponent } from './cargos/components/cargo/cargo.component';
import { CatalogoElementoComponent } from './elementos/components/elemento/elemento.component';
import { ParametrosGenComponent } from './parametros-gen/components/parametros-gen/parametros-gen.component';
import { TurnosComponent } from './turnos/components/turnos/turnos.component';
import { RiesgosArlComponent } from './riesgos-arl/components/riesgos-arl/riesgos-arl.component';
import { LineasNegocioComponent } from './lineas-negocio/components/lineas-negocio/lineas-negocio.component';
import { AreasComponent } from './areas/components/areas/areas.component';
import { SubcargosComponent } from './subcargos/components/subcargos/subcargos.component';
import { FormTurnosComponent } from './turnos/components/form-turnos/form-turnos.component';
import { TipoSalarioComponent } from './tipos-salarios/components/tipo-salario/tipo-salario.component';
import { FormTipoSalarioComponent } from './tipos-salarios/components/form-tipo-salario/form-tipo-salario.component';
import { HorasTrabajoComponent } from './horas-trabajo/components/horas-trabajo/horas-trabajo.component';
import { FormHorasTrabajoComponent } from './horas-trabajo/components/form-horas-trabajo/form-horas-trabajo.component';
import { ConceptoBaseSalarialComponent } from './concepto-base-salarial/components/concepto-base-salarial/concepto-base-salarial.component';
import { TextoCotizacionComponent } from './texto-cotizacion/components/texto-cotizacion/texto-cotizacion.component';
import { CalendarioComponent } from './calendario/components/calendario/calendario.component';
import { FormSubcargosComponent } from './subcargos/components/form-subcargos/form-subcargos.component';
import { AreasCrearEditComponent } from './areas/components/areas-crear-edit/areas-crear-edit.component';
import { PolizasComponent } from './polizas/components/polizas/polizas.component';
import { ConceptoBaseSalarialCrearEditarComponent } from './concepto-base-salarial/components/concepto-base-salarial-crear-editar/concepto-base-salarial-crear-editar.component';
import { MsalGuard } from '@azure/msal-angular';
import { NotificacionesComponent } from './notificaciones/components/notificaciones/notificaciones.component';
import { FormNotificacionesComponent } from './notificaciones/components/form-notificaciones/form-notificaciones.component';

const routes: Routes = [
  { path: '', component: MenuCatalogoComponent, canActivate: [MsalGuard] },
  {
    path: 'cargo',
    component: CargoComponent,
    data: { breadcrumb: 'Cargos' },
    canActivate: [MsalGuard],
  },
  {
    path: 'elemento',
    component: CatalogoElementoComponent,
    data: { breadcrumb: 'Elementos' },
    canActivate: [MsalGuard],
  },
  {
    path: 'parametroGen',
    component: ParametrosGenComponent,
    data: { breadcrumb: 'Parámetros generales' },
    canActivate: [MsalGuard],
  },
  {
    path: 'riesgosArl',
    component: RiesgosArlComponent,
    data: { breadcrumb: 'Riesgos ARL' },
    canActivate: [MsalGuard],
  },
  {
    path: 'lineaNegocio',
    component: LineasNegocioComponent,
    data: { breadcrumb: 'Líneas de negocio' },
    canActivate: [MsalGuard],
  },
  {
    path: 'areas',
    component: AreasComponent,
    canActivate: [MsalGuard],
    children: [
      {
        path: 'crear',
        component: AreasCrearEditComponent,
        data: { breadcrumb: 'Crear' },
        canActivate: [MsalGuard],
      },
      {
        path: 'editar',
        component: AreasCrearEditComponent,
        data: { breadcrumb: 'Editar' },
        canActivate: [MsalGuard],
      },
    ],
    data: { breadcrumb: 'Áreas' },
  },
  {
    path: 'subcargos',
    data: { breadcrumb: 'Subcargos' },
    component: SubcargosComponent,
    canActivate: [MsalGuard],
    children: [
      {
        path: 'crear',
        component: FormSubcargosComponent,
        data: { breadcrumb: 'Crear' },
        canActivate: [MsalGuard],
      },
      {
        path: 'editar',
        component: FormSubcargosComponent,
        data: { breadcrumb: 'Editar' },
        canActivate: [MsalGuard],
      },
    ],
  },
  {
    path: 'tipoSalarios',
    component: TipoSalarioComponent,
    data: { breadcrumb: 'Tipos de salario' },
    canActivate: [MsalGuard],
    children: [
      {
        path: 'crear',
        component: FormTipoSalarioComponent,
        data: { breadcrumb: 'Crear' },
        canActivate: [MsalGuard],
      },
      {
        path: 'editar',
        component: FormTipoSalarioComponent,
        data: { breadcrumb: 'Editar' },
        canActivate: [MsalGuard],
      },
    ],
  },
  {
    path: 'horasTrabajo',
    component: HorasTrabajoComponent,
    data: { breadcrumb: 'Horas de trabajo' },
    canActivate: [MsalGuard],
    children: [
      {
        path: 'crear',
        component: FormHorasTrabajoComponent,
        data: { breadcrumb: 'Crear' },
        canActivate: [MsalGuard],
      },
      {
        path: 'editar',
        component: FormHorasTrabajoComponent,
        data: { breadcrumb: 'Editar' },
        canActivate: [MsalGuard],
      },
    ],
  },

  {
    path: 'conceptoBaseSalarial',
    component: ConceptoBaseSalarialComponent,
    data: { breadcrumb: 'Condiciones salariales' },
    children: [
      {
        path: 'crear',
        component: ConceptoBaseSalarialCrearEditarComponent,
        data: { breadcrumb: 'Crear' },
      },
      {
        path: 'editar',
        component: ConceptoBaseSalarialCrearEditarComponent,
        data: { breadcrumb: 'Editar' },
      },
    ],
    canActivate: [MsalGuard],
  },
  {
    path: 'notasCotizacion',
    component: TextoCotizacionComponent,
    data: { breadcrumb: 'Notas de cotizaciones' },
    canActivate: [MsalGuard],
  },
  {
    path: 'calendario',
    component: CalendarioComponent,
    data: { breadcrumb: 'Festivos' },
    canActivate: [MsalGuard],
  },
  {
    path: 'polizas',
    component: PolizasComponent,
    data: { breadcrumb: 'Pólizas' },
    canActivate: [MsalGuard],
  },
  {
    path: 'notificaciones',
    data: { breadcrumb: 'Notificaciones' },
    component: NotificacionesComponent,
    canActivate: [MsalGuard],
    children: [
      {
        path: 'crear',
        component: FormNotificacionesComponent,
        data: { breadcrumb: 'Crear' },
        canActivate: [MsalGuard],
      },
      {
        path: 'editar',
        component: FormNotificacionesComponent,
        data: { breadcrumb: 'Editar' },
        canActivate: [MsalGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogosRoutingModule {}
