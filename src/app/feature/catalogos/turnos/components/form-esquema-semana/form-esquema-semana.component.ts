import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EsquemasService } from '../../service/esquemas.service';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-esquema-semana',
  templateUrl: './form-esquema-semana.component.html',
  styleUrls: ['./form-esquema-semana.component.css'],
})
export class FormEsquemaSemanaComponent implements OnInit {
  weekFormGroup: FormGroup;
  action: string | undefined;
  titleButton: string;

  constructor(
    public dialogRef: MatDialogRef<FormEsquemaSemanaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private esquemasService: EsquemasService,
    private spinner: NgxSpinnerService
  ) {
    this.action = data.title;
    this.weekFormGroup = this._formBuilder.group({
      id: 0,
      shiftId: 0,
      hoursForDay: 0,
      daysForWeek: 0,
      hoursForWeek: 0,
      hoursDaysForPerson: 0,
      daysWeekForPerson: [
        data.daysWeekForPerson,
        [Validators.required, Validators.min(1), Validators.max(7)],
      ],
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
    this.weekFormGroup.patchValue({
      daysWeekForPerson: this.data.daysWeekForPerson,
    });
  }

  updateDayWeekPerson() {
    this.weekFormGroup.markAllAsTouched();
    if (this.weekFormGroup.invalid) {
      return;
    }
    const esquemaId = this.data.esquemaId;
    const { daysWeekForPerson } = this.weekFormGroup.value;
    this.spinner.show();
    this.esquemasService
      .updateSchemeDaysWeekPerson(daysWeekForPerson, esquemaId)
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

  onAction(): void {
    if (this.action === 'agregar') {
      this.titleButton = 'Guardar';
    } else if (this.action === 'editar') {
      this.titleButton = 'Editar';
    }
  }

  close(isEdit: boolean) {
    this.dialogRef.close(isEdit);
  }

  get daysWeekForPerson() {
    return this.weekFormGroup.get('daysWeekForPerson')?.value;
  }
}
