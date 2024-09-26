import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InicioComponent } from './home/inicio/inicio.component';
import { MsalGuard } from '@azure/msal-angular';
import { TurnosComponent } from './catalogos/turnos/components/turnos/turnos.component';
import { FormTurnosComponent } from './catalogos/turnos/components/form-turnos/form-turnos.component';
import { IncrementoArchivoComponent } from './proveedores/components/incremento-archivo/incremento-archivo.component';
import { authGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [MsalGuard],
    children: [
      {
        path: 'inicio',
        component: InicioComponent,
        data: { breadcrumb: 'Inicio' },
      },
      {
        canActivate: [authGuard],
        path: 'catalogo',
        loadChildren: () =>
          import('./catalogos/catalogos.module').then((m) => m.CatalogosModule),
        data: { breadcrumb: 'Catálogos' },
      },
      {
        canActivate: [authGuard],
        path: 'cotizaciones',
        loadChildren: () =>
          import('./cotizaciones/cotizaciones.module').then(
            (m) => m.CotizacionesModule
          ),
      },
      {
        canActivate: [authGuard],
        path: 'roles',
        loadChildren: () =>
          import('../../app/feature/roles/roles.module').then(
            (m) => m.RolesModule
          ),
      },
      {
        canActivate: [authGuard],
        path: 'proveedores',
        loadChildren: () =>
          import('../../app/feature/proveedores/proveedores.module').then(
            (m) => m.ProveedoresModule
          ),
      },
      {
        canActivate: [authGuard],
        path: 'incremento',
        component: IncrementoArchivoComponent,
        data: { breadcrumb: 'Incremento por archivo' },
      },
      {
        canActivate: [authGuard],
        path: 'elementos',
        loadChildren: () =>
          import('../../app/feature/elementos/elementos.module').then(
            (m) => m.ElementosModule
          ),
      },
      {
        canActivate: [authGuard],
        path: 'clientes',
        loadChildren: () =>
          import('../../app/feature/clientes/clientes.module').then(
            (m) => m.ClientesModule
          ),
      },
      {
        canActivate: [authGuard, MsalGuard],
        path: 'turnos',
        component: TurnosComponent,
        data: { breadcrumb: 'Turnos y esquemas' },
        // canActivate: [MsalGuard],
        children: [
          {
            path: 'crear',
            component: FormTurnosComponent,
            data: { breadcrumb: 'Crear' },
            // canActivate: [MsalGuard],
          },
          {
            path: 'editar',
            component: FormTurnosComponent,
            data: { breadcrumb: 'Editar' },
            // canActivate: [MsalGuard],
          },
        ],
      },
      {
        canActivate: [authGuard],
        path: 'reportes',
        loadChildren: () =>
          import('../../app/feature/reportes/reportes.module').then(
            (m) => m.ReportesModule
          ),
      },
      {
        canActivate: [authGuard],
        path: 'estadisticas',
        loadChildren: () =>
          import('../../app/feature/estadisticas/estadisticas.module').then(
            (m) => m.EstadisticasModule
          ),
      },
      {
        canActivate: [authGuard],
        path: 'historico',
        loadChildren: () =>
          import('../../app/feature/historico/historico.module').then(
            (m) => m.HistoricoModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
