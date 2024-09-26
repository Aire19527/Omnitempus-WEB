import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedoresService } from '../../service/proveedores.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Elemento } from 'src/app/feature/elementos/models/elementos';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';

@Component({
  selector: 'app-form-elementos-proveedor',
  templateUrl: './registrar-incremento.component.html',
  styleUrls: ['./registrar-incremento.component.css'],
})
export class RegistrarIncrementoComponent implements OnInit {
  elementProviderFormGroup: FormGroup;
  titleButton: string;
  action: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<RegistrarIncrementoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private proveedoresService: ProveedoresService,
    private spinner: NgxSpinnerService
  ) {
    this.action = data.title;
    this.elementProviderFormGroup = this._formBuilder.group({
      elementProviderId: null,
      percentageIncrement: [null,[Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  ngOnInit(): void {

  }

  saveIncrementElements() {
    this.elementProviderFormGroup.markAllAsTouched();
    if (this.elementProviderFormGroup.invalid) {
      return;
    }
    this.spinner.show();
    let providerWhitIncrement: any[] = [];
    this.data.data.forEach((element: Elemento) => {
      providerWhitIncrement.push({
        elementProviderId: element.id,
        percentageIncrement: this.percentageIncrement?.value,
      });
    });
    this.proveedoresService.saveIncrementElements(providerWhitIncrement).subscribe({
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

  close(isEdit: boolean) {
    this.dialogRef.close(isEdit);
  }

  closeModal() {
    this.dialogRef.close();
  }

  get percentageIncrement() {
    return this.elementProviderFormGroup.get('percentageIncrement');
  }
}
