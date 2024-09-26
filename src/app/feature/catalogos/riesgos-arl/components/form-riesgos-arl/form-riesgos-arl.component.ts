import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RiesgosArlService } from '../../service/riesgos-arl.service';
import { AddRisk, Risk } from '../../models/riesgos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-riesgos-arl',
  templateUrl: './form-riesgos-arl.component.html',
  styleUrls: ['./form-riesgos-arl.component.css'],
})
export class FormRiesgosArlComponent implements OnInit {
  riesgoForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<FormRiesgosArlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Risk,
    private _formBuilder: FormBuilder,
    private riesgosArlService: RiesgosArlService,
    private spinner: NgxSpinnerService
  ) {
    this.riesgoForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      percentage: [
        '',
        [
          Validators.required,
          Validators.compose([Validators.min(0), Validators.max(100)]),
        ],
      ],
      description: [''],
    });
    this.riesgoForm.patchValue(this.data);
  }

  ngOnInit(): void {}

  saveUpdateRisk() {
    this.riesgoForm.markAllAsTouched();
    if (this.riesgoForm.valid) {
      if (!this.data) this.insert();
      if (this.data) this.update();
    }
  }

  insert() {
    let add: AddRisk = {
      name: this.riesgoForm.get('name')?.value,
      percentage: this.riesgoForm.get('percentage')?.value,
      description: this.riesgoForm.get('description')?.value,
    };

    this.spinner.show();
    this.riesgosArlService.saveRisk(add).subscribe({
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
    let update: Risk = {
      name: this.riesgoForm.get('name')?.value,
      percentage: this.riesgoForm.get('percentage')?.value,
      description: this.riesgoForm.get('description')?.value,
      id: this.data.id,
    };

    this.spinner.show();
    this.riesgosArlService.updateRisk(update).subscribe({
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
}
