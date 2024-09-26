import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EsquemasService } from '../../service/esquemas.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-esquema-horas',
  templateUrl: './form-esquema-horas.component.html',
  styleUrls: ['./form-esquema-horas.component.css'],
})
export class FormEsquemaHorasComponent implements OnInit {
  hourFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormEsquemaHorasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private esquemaService: EsquemasService,
    private spinner: NgxSpinnerService
  ) {
    this.hourFormGroup = this._formBuilder.group({
      id: 0,
      shiftId: 0,
      hoursForDay: 0,
      daysForWeek: 0,
      hoursForWeek: 0,
      hoursDaysForPerson: [data.hoursDaysForPerson,[Validators.required, Validators.min(1), Validators.max(16)]],
      daysWeekForPerson: 0,
      hoursWeekForPerson: 0,
      personRequired: 0,
      shift: null,
      schemesPerson: null,
      createdAt: null,
      createdBy: null,
      lastModifiedByAt: null,
      lastModifiedBy: null,
      deletedByAt: null,
      deletedBy: null,
      newValues: null,
      oldValues: null,
      isActive: true,
    });
  }

  ngOnInit(): void {

  }

  updateHoursDayPerson() {
    this.hourFormGroup.markAllAsTouched();
    if (this.hourFormGroup.invalid) {
      return;
    }
    const esquemaId = this.data.esquemaId;
    const { hoursDaysForPerson } = this.hourFormGroup.value;
    this.spinner.show();
    this.esquemaService
      .updateSchemesHoursDayPerson(hoursDaysForPerson, esquemaId)
      .subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
          } else {
            Alert.toastSWMessage('warning', response.message);
          }
          this.close(true);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }

  close(isEdit: boolean) {
    this.dialogRef.close(isEdit);
  }

  get hoursDaysForPerson() {
    return this.hourFormGroup.get('hoursDaysForPerson');
  }
}
