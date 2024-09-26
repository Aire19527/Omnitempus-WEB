import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LineasNegocioService } from '../../service/lineas-negocio.service';
import { BusinessLines } from '../../models/lineasNegocio';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-lineas-negocio',
  templateUrl: './form-lineas-negocio.component.html',
  styleUrls: ['./form-lineas-negocio.component.css'],
})
export class FormLineasNegocioComponent implements OnInit {
  action: string | undefined;
  businessLineFormGroup: FormGroup;
  titleButton: string;
  bussinesLinesList: BusinessLines[] = [];
  mensaje: string;

  constructor(
    public dialogRef: MatDialogRef<FormLineasNegocioComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _formBuilder: FormBuilder,
    private lineasNegocioService: LineasNegocioService,
    private spinner: NgxSpinnerService
  ) {
    this.action = data.title;
    this.businessLineFormGroup = this._formBuilder.group({
      id: 0,
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.onAction();
    this.setData();
    this.getBussinesLines();
  }

  setData() {
    if (this.data.data) {
      this.businessLineFormGroup.patchValue(this.data.data);
    }
  }

  getBussinesLines() {
    this.lineasNegocioService
      .getBusinessLines()
      .subscribe((res: BusinessLines[]) => {
        this.bussinesLinesList = res;
      });
  }

  saveUpdateLines() {
    this.businessLineFormGroup.markAllAsTouched();
    if (this.businessLineFormGroup.invalid) {
      return;
    }

    if (this.action === 'crear') {
      this.spinner.show();
      this.lineasNegocioService
        .saveBusinessLines(this.businessLineFormGroup.value)
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
    } else if (this.action === 'editar') {
      this.spinner.show();
      this.lineasNegocioService
        .updateBusinessLines(this.businessLineFormGroup.value)
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
  }

  close(isEdit: boolean) {
    this.dialogRef.close(isEdit);
  }

  closeModal() {
    this.dialogRef.close();
  }

  onAction(): void {
    if (this.action === 'crear') {
      this.titleButton = 'Guardar';
    } else if (this.action === 'editar') {
      this.titleButton = 'Guardar';
    }
  }

  get code() {
    return this.businessLineFormGroup.get('code');
  }
  get name() {
    return this.businessLineFormGroup.get('name');
  }
}
