import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterGen } from 'src/app/feature/catalogos/parametros-gen/models/parametro-gen';
import { ParametroGenService } from 'src/app/feature/catalogos/parametros-gen/service/parametro-gen.service';
import {
  AddBonoOT,
  BonosOT,
  UpdateBonoOT,
} from 'src/app/feature/cotizaciones/models/bonos-ot';
import { ElementypeElementService } from 'src/app/feature/cotizaciones/service/elementype-element.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';

@Component({
  selector: 'app-crear-editar-bono-ot',
  templateUrl: './crear-editar-bono-ot.component.html',
  styleUrls: ['./crear-editar-bono-ot.component.css'],
})
export class CrearEditarBonoOTComponent implements OnInit {
  bonoFormGroup: FormGroup;
  parametersList: any[] = [];
  selectedParameter: ParameterGen | undefined;

  constructor(
    public dialogRef: MatDialogRef<CrearEditarBonoOTComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      element: BonosOT;
      parameters: ParameterGen[];
      subChargesQuotationId: number;
      depreciation: number; 
    },
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private elementypeElementService: ElementypeElementService,
    private ParametroGenService: ParametroGenService,
  ) {
    this.bonoFormGroup = this._formBuilder.group({
      generalParametersId: ['', [Validators.required]],
      cost: [
        '',
        [Validators.required, Validators.compose([Validators.min(1)])],
      ],
      depreciation: [
        this.data.depreciation,
        [
          Validators.required,
          Validators.compose([Validators.min(0), Validators.max(100)]),
        ],
      ],
      quantity: [
        1,
        [
          Validators.required,
          Validators.compose([Validators.min(0), Validators.max(100)]),
        ],
      ],
    });

    if (this.data.element) {
      this.bonoFormGroup.patchValue(this.data.element);
    }
  }

  ngOnInit(): void {}


  onParameterSelectionChange() {
    const parameterId = this.bonoFormGroup.get('generalParametersId')?.value;
    this.selectedParameter = this.data.parameters.find(
      (param) => param.id === parameterId
    );

    if (this.selectedParameter) {
      this.bonoFormGroup.get('cost')?.setValue(this.selectedParameter.value);
    }
  }


  saveUpdateBono() {
    if (this.data.element) {
      this.updateBonusOT();
    } else {
      this.addBonusOT();
    }
  }

  updateBonusOT() {
    const model: UpdateBonoOT = {
      id: this.data.element.id,
      cost: this.bonoFormGroup.get('cost')?.value,
      quantity: this.bonoFormGroup.get('quantity')?.value,
      generalParametersId: this.bonoFormGroup.get('generalParametersId')?.value,
      depreciation: this.bonoFormGroup.get('depreciation')?.value,
      subChargesQuotationId: this.data.subChargesQuotationId,
    };
    this.data.element;
    this.spinner.show();
    this.elementypeElementService.updateBonusOT(model).subscribe({
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
        console.error(error);
        Alert.errorHttp(error);
      },
    });
  }

  addBonusOT() {
    const model: AddBonoOT = {
      cost: this.bonoFormGroup.get('cost')?.value,
      quantity: this.bonoFormGroup.get('quantity')?.value,
      generalParametersId: this.bonoFormGroup.get('generalParametersId')?.value,
      depreciation: this.bonoFormGroup.get('depreciation')?.value,
      subChargesQuotationId: this.data.subChargesQuotationId,
    };
    this.spinner.show();
    this.elementypeElementService.addBonusOT(model).subscribe({
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
        console.error(error);
        Alert.errorHttp(error);
      },
    });
  }
}
