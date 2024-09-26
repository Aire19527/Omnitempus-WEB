import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMaterialModule } from './modules/ng-material.module';
import { TableComponent } from './components/table/table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgChartsModule } from 'ng2-charts';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export const options: Partial<null | IConfig> | (() => Partial<IConfig>) = null;
@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgMaterialModule,
    MatPaginatorModule,
    MatSortModule,
    MatListModule,
    MatAutocompleteModule,
    AsyncPipe,
    NgxMaskModule.forRoot(),
  ],
  exports: [
    ReactiveFormsModule,
    TableComponent,
    NgMaterialModule,
    MatPaginatorModule,
    MatSortModule,
    NgxMaskModule,
    MatListModule,
    NgChartsModule,
    MatAutocompleteModule,
    AsyncPipe
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class SharedModule {}
