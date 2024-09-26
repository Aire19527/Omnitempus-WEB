import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { CrearProveedoresComponent } from './components/crear-proveedores/crear-proveedores.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ElementosProveedorComponent } from './components/elementos-proveedor/elementos-proveedor.component';
import { RegistrarIncrementoComponent } from './components/registrar-incremento/registrar-incremento.component';
import { IncrementoComponent } from './components/incremento/incremento.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { IncrementoArchivoComponent } from './components/incremento-archivo/incremento-archivo.component';

@NgModule({
  declarations: [
    ProveedoresComponent,
    CrearProveedoresComponent,
    ElementosProveedorComponent,
    RegistrarIncrementoComponent,
    IncrementoComponent,
    IncrementoArchivoComponent,
  ],
  imports: [
    CommonModule,
    ProveedoresRoutingModule,
    SharedModule,
    CdkStepperModule,
  ],
  exports: [
    ProveedoresComponent,
    CrearProveedoresComponent,
    ElementosProveedorComponent,
    RegistrarIncrementoComponent,
    IncrementoComponent,
    IncrementoArchivoComponent,
    CdkStepperModule,
  ],
})
export class ProveedoresModule {}
