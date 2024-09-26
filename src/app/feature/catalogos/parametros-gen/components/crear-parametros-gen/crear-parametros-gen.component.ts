import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ParametroGenService } from '../../service/parametro-gen.service';
import { ParameterGen } from '../../models/parametro-gen';
import { Alert } from 'src/app/helpers/alert_helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { MONEDA, NUMERO, PORCENTAJE, TIEMPO } from 'src/app/helpers/constants';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-parametros-gen',
  templateUrl: './crear-parametros-gen.component.html',
  styleUrls: ['./crear-parametros-gen.component.css'],
})
export class CrearParametrosGenComponent implements OnInit {
  parameterFormGroup: FormGroup;
  titleButton: string;
  CONS_MONEDA: string = MONEDA;
  CONS_NUMERO: string = NUMERO;
  CONS_PORCENTAJE: string = PORCENTAJE;
  CONS_TIEMPO: string = TIEMPO;
  startTime: string = '12:00';
  finalHour: string = '12:00';

  constructor(
    public dialoref: MatDialogRef<CrearParametrosGenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ParameterGen,
    private _formBuilder: FormBuilder,
    private parameterGenService: ParametroGenService,
    private spinner: NgxSpinnerService
  ) {
    this.parameterFormGroup = this._formBuilder.group({
      parameter: new FormControl({ value: '', disabled: true }),
      parameterType: new FormControl({ value: '', disabled: true }),
      value: [
        '',
        !this.data.isRange
          ? [
              Validators.compose([
                Validators.required,
                Validators.min(this.data.minimumAllowedValue),
                Validators.max(this.data.maximumAllowedValue),
              ]),
            ]
          : false,
      ],
      minimumValue: [
        '',
        this.data.isRange
          ? [
              Validators.compose([
                Validators.required,
                Validators.min(this.data.minimumAllowedValue),
                Validators.max(this.data.maximumAllowedValue),
              ]),
            ]
          : false,
      ],
      maximumValue: [
        '',
        this.data.isRange
          ? [
              Validators.compose([
                Validators.required,
                Validators.min(this.data.minimumAllowedValue),
                Validators.max(this.data.maximumAllowedValue),
              ]),
            ]
          : false,
      ],
      description: [''],
    });

    this.parameterFormGroup.patchValue(this.data);
    if (this.data.valueType.toLowerCase() == this.CONS_TIEMPO) {
      this.startTime = this.convertNumberToTime(Number(this.data.minimumValue));
      this.finalHour = this.convertNumberToTime(Number(this.data.maximumValue));
    }
  }

  ngOnInit(): void {}

  saveUpdateParameter() {
    this.parameterFormGroup.markAllAsTouched();
    if (this.parameterFormGroup.valid) {
      this.update();
    } else {
      Alert.warning('Hay registros obligatorios por definir.');
    }
  }

  update() {
    this.data.value = this.parameterFormGroup.get('value')?.value;
    this.data.description = this.parameterFormGroup.get('description')?.value;
    this.data.isEditable =
      this.parameterFormGroup.get('isEditable')?.value == 'true' ? true : false;

    if (this.data.valueType.toLowerCase() == this.CONS_TIEMPO) {
      this.data.minimumValue = this.convertHour(
        this.parameterFormGroup.get('minimumValue')?.value
      ).toString();
      this.data.maximumValue = this.convertHour(
        this.parameterFormGroup.get('maximumValue')?.value
      ).toString();
    } else {
      this.data.minimumValue =
        this.parameterFormGroup.get('minimumValue')?.value;
      this.data.maximumValue =
        this.parameterFormGroup.get('maximumValue')?.value;
    }
    this.spinner.show();
    this.parameterGenService.updateParameter(this.data).subscribe({
      next: (response) => {
        this.spinner.hide();
        Alert.toastSWMessage('success', 'Se actualizó con éxito.');
        this.close(true);
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
        Alert.error('Ha ocurrido un error, por favor vuelva a intentarlo.');
      },
    });
  }

  close(isEdit: boolean) {
    this.dialoref.close(isEdit);
  }

  maxLength() {
    let length: number = 10;
    switch (this.data.valueType.toLowerCase()) {
      case this.CONS_MONEDA: {
        length = this.data.maximumAllowedValue.toString().length;
        length = length + 4;
        break;
      }
      case this.CONS_PORCENTAJE: {
        length = this.data.maximumAllowedValue.toString().length;
        length = length + 3;
        break;
      }
      case this.CONS_NUMERO: {
        length = this.data.maximumAllowedValue.toString().length;
        length = length + 3;
        break;
      }
      case this.CONS_TIEMPO: {
        break;
      }
    }

    return length;
  }

  convertHour(text: string): number {
    // Dividir la cadena de hora en horas y minutos
    const partes: string[] = text.split(':');

    // Obtener las horas y los minutos como números
    const horas: number = parseInt(partes[0], 10);
    const minutos: number = partes.length > 1 ? parseInt(partes[1], 10) : 0;

    // Formatear el resultado como un solo número con dos decimales
    const resultado: number = horas + minutos / 100;

    return resultado;
  }

  convertNumberToTime(number: number): string {
    // Get hours and minutes as separate numbers
    const hours: number = Math.floor(number);
    const minutes: number = Math.round((number - hours) * 100);

    // Format hours and minutes as a time string
    const timeString: string = `${this.addLeadingZeros(
      hours
    )}:${this.addLeadingZeros(minutes)}`;

    return timeString;
  }

  // Helper function to add leading zeros if necessary
  addLeadingZeros(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
