import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddPolizaModel, PolizaModel } from '../../models/poliza';
import { NgxSpinnerService } from 'ngx-spinner';
import { PolizasService } from '../../service/polizas.service';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-polizas-crear-editar',
  templateUrl: './polizas-crear-editar.component.html',
  styleUrls: ['./polizas-crear-editar.component.css'],
})
export class PolizasCrearEditarComponent {
  polizaFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<PolizasCrearEditarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PolizaModel,
    private _formBuilder: FormBuilder,
    private polizaService: PolizasService,
    private spinner: NgxSpinnerService
  ) {
    this.polizaFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      percentage: [
        '',

        [
          Validators.required,
          Validators.compose([Validators.min(0), Validators.max(100)]),
        ],
      ],
    });
    this.polizaFormGroup.patchValue(this.data);
  }

  saveUpdatePolicy() {
    this.polizaFormGroup.markAllAsTouched();
    if (this.polizaFormGroup.valid) {
      if (!this.data) this.insert();
      if (this.data) this.update();
    }
  }

  insert() {
    let add: AddPolizaModel = {
      name: this.polizaFormGroup.get('name')?.value,
      percentage: this.polizaFormGroup.get('percentage')?.value,
    };
    this.spinner.show();
    this.polizaService.save(add).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
        } else {
          Alert.toastSWMessage('warning', response.message);
        }
        this.dialogRef.close(true);
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
      },
    });
  }

  update() {
    this.data.name = this.polizaFormGroup.get('name')?.value;
    this.data.percentage = this.polizaFormGroup.get('percentage')?.value;

    this.spinner.show();
    this.polizaService.update(this.data).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
        } else {
          Alert.toastSWMessage('warning', response.message);
        }
        this.dialogRef.close(true);
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
}
