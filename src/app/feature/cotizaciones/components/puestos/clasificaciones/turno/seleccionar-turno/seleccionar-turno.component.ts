import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  AddShiftQuotatioDto,
  Turnos,
} from 'src/app/feature/catalogos/turnos/models/turnos';
import { TurnosService } from 'src/app/feature/catalogos/turnos/service/turnos.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';

@Component({
  selector: 'app-seleccionar-turno',
  templateUrl: './seleccionar-turno.component.html',
  styleUrls: ['./seleccionar-turno.component.css'],
})
export class SeleccionarTurnoComponent implements OnInit {
  turnosFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<SeleccionarTurnoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      turnos: Turnos[];
      subChargesQuotationId: number;
      idShift: number;
    },
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private turnosService: TurnosService
  ) {
    this.turnosFormGroup = this._formBuilder.group({
      idShift: ['', [Validators.required]],
    });

    if (this.data.idShift != 0) {
      this.turnosFormGroup.setValue({ idShift: this.data.idShift });
    }
  }

  ngOnInit(): void {}

  save() {
    const idShift = this.turnosFormGroup.get('idShift')?.value;
    const add: AddShiftQuotatioDto = {
      shiftId: idShift,
      subChargesQuotationId: this.data.subChargesQuotationId,
    };
    this.spinner.show();
    this.turnosService.addShiftQuotation(add).subscribe({
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
