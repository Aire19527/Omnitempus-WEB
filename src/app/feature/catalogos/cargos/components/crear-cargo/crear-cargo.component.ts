import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CargoService } from '../../service/cargo.service';
import { Risk } from '../../../riesgos-arl/models/riesgos';
import { AddCargoModel, Cargo } from '../../models/cargo';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-cargo',
  templateUrl: './crear-cargo.component.html',
  styleUrls: ['./crear-cargo.component.css'],
})
export class CrearCargoComponent {
  cargoFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CrearCargoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cargo: Cargo;
      risks: Risk[];
    },
    private _formBuilder: FormBuilder,
    private cargoService: CargoService,
    private spinner: NgxSpinnerService
  ) {
    this.cargoFormGroup = this._formBuilder.group({
      name: ['', [Validators.required]],
      baseSalary: ['', [Validators.required]],
      description: [''],
      riskARLId: ['', [Validators.required]],
      comprehensiveSalary: ['', [Validators.required]],
      trainingHours: [
        '',
        [Validators.required, Validators.max(10), Validators.min(0.01)],
      ],
    });
    this.cargoFormGroup.patchValue(this.data.cargo);
  }

  saveUpdateCargo() {
    this.cargoFormGroup.markAllAsTouched();
    if (this.cargoFormGroup.valid) {
      if (!this.data.cargo) this.insert();
      if (this.data.cargo) this.update();
    }
  }

  insert() {
    let add: AddCargoModel = {
      name: this.cargoFormGroup.get('name')?.value,
      baseSalary: this.cargoFormGroup.get('baseSalary')?.value,
      comprehensiveSalary: this.cargoFormGroup.get('comprehensiveSalary')
        ?.value,
      riskARLId: this.cargoFormGroup.get('riskARLId')?.value,
      description: this.cargoFormGroup.get('description')?.value,
      trainingHours: this.cargoFormGroup.get('trainingHours')?.value,
    };
    this.spinner.show();
    this.cargoService.saveCargo(add).subscribe({
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
    this.data.cargo.name = this.cargoFormGroup.get('name')?.value;
    this.data.cargo.baseSalary = this.cargoFormGroup.get('baseSalary')?.value;
    this.data.cargo.comprehensiveSalary = this.cargoFormGroup.get(
      'comprehensiveSalary'
    )?.value;
    this.data.cargo.riskARLId = this.cargoFormGroup.get('riskARLId')?.value;
    this.data.cargo.description = this.cargoFormGroup.get('description')?.value;
    this.data.cargo.trainingHours =
      this.cargoFormGroup.get('trainingHours')?.value;
    this.spinner.show();
    this.cargoService.updateCargo(this.data.cargo).subscribe({
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
