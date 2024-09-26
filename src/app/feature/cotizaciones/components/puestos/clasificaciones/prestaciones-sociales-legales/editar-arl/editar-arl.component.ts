import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Risk } from 'src/app/feature/catalogos/riesgos-arl/models/riesgos';
import {
  RiskARLQuotationDto,
  UpdateRiskARLQuotationDto,
} from 'src/app/feature/catalogos/subcargos/models/elementsProvider';
import { RiskARLEstimateService } from 'src/app/feature/cotizaciones/service/risk-arlestimate.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';

@Component({
  selector: 'app-editar-arl',
  templateUrl: './editar-arl.component.html',
  styleUrls: ['./editar-arl.component.css'],
})
export class EditarARLComponent implements OnInit {
  arlFormGroup: FormGroup;
  constructor(
    private riskARLEstimateService: RiskARLEstimateService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<EditarARLComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      risk: RiskARLQuotationDto;
      risks: Risk[];
    },
    private _formBuilder: FormBuilder
  ) {
    this.arlFormGroup = this._formBuilder.group({
      riskARLId: ['', Validators.required],
    });
    this.arlFormGroup.setValue({ riskARLId: this.data.risk?.riskARLId });
  }

  ngOnInit(): void {}

  update() {
    const arl = this.data.risks.find(
      (x) => x.id == this.arlFormGroup.get('riskARLId')?.value
    );
    const update: UpdateRiskARLQuotationDto = {
      id: this.data.risk.id,
      percentage: arl?.percentage!,
      riskARLId: arl?.id!,
    };
    this.spinner.show();
    this.riskARLEstimateService.update(update).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          this.dialogRef.close(true);
        } else {
          Alert.toastSWMessage('warning', response.message);
        }
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
      },
    });
  }
}
