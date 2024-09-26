import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgFor } from '@angular/common';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatNativeDateModule } from '@angular/material/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxGaugeModule } from 'ngx-gauge';

@NgModule({
  declarations: [],
  imports: [CommonModule, NgxMaterialTimepickerModule.setOpts('es-ES')],
  exports: [
    NgxMaterialTimepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
    MatCheckboxModule,
    FormsModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    CdkAccordionModule,
    NgFor,
    MatRadioModule,
    MatMenuModule,
    HttpClientModule,
    NgIf,
    JsonPipe,
    MatNativeDateModule,
    MatSnackBarModule,
    FullCalendarModule,
    MatExpansionModule,
    MatTooltipModule,
    NgxGaugeModule,
  ],
})
export class NgMaterialModule {}
