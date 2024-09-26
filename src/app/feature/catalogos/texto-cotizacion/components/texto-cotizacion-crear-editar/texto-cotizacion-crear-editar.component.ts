import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextoCotizacionService } from '../../service/texto-cotizacion.service';
import {
  AddTextoCotizacionModel,
  TextoCotizacionModel,
} from '../../models/textp-cotizacion';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import {
  DepartamentModel,
  MunicipalityModel,
} from 'src/app/shared/models/departament-model';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-texto-cotizacion-crear-editar',
  templateUrl: './texto-cotizacion-crear-editar.component.html',
  styleUrls: ['./texto-cotizacion-crear-editar.component.css'],
})
export class TextoCotizacionCrearEditarComponent implements OnInit {
  textoCotizacionFormGroup: FormGroup;

  departaments: DepartamentModel[] = [];
  municipalities: MunicipalityModel[] = [];
  constructor(
    public dialoref: MatDialogRef<TextoCotizacionCrearEditarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TextoCotizacionModel,
    private _formBuilder: FormBuilder,
    private textoCotizacionService: TextoCotizacionService,
    private spinner: NgxSpinnerService
  ) {
    this.textoCotizacionFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      noteText: ['', [Validators.required, Validators.maxLength(1000)]],
    });
    this.textoCotizacionFormGroup.patchValue(this.data);
  }

  ngOnInit(): void {}

  submit() {
    if (this.data) {
      this.update();
    } else {
      this.save();
    }
  }

  save() {
    if (this.textoCotizacionFormGroup.valid) {
      const add: AddTextoCotizacionModel = {
        name: this.textoCotizacionFormGroup.get('name')?.value,
        noteText: this.textoCotizacionFormGroup.get('noteText')?.value,
      };

      this.spinner.show();
      this.textoCotizacionService.save(add).subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
          } else {
            Alert.toastSWMessage('warning', response.message);
          }
          this.dialoref.close(true);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
    }
  }

  update() {
    if (this.textoCotizacionFormGroup.valid) {
      const update: TextoCotizacionModel = {
        name: this.textoCotizacionFormGroup.get('name')?.value,
        noteText: this.textoCotizacionFormGroup.get('noteText')?.value,
        id: this.data.id,
      };
      this.spinner.show();
      this.textoCotizacionService.update(update).subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
          } else {
            Alert.toastSWMessage('warning', response.message);
          }
          this.dialoref.close(true);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
    }
  }
}
