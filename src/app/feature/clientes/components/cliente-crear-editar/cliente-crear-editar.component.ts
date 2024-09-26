import { Component, OnInit, Inject } from '@angular/core';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';
import { AddCliente, Cliente } from '../../models/clientes';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from '../../service/clientes.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Utiles } from 'src/app/helpers/utiles_helpers';

@Component({
  selector: 'app-cliente-crear-editar',
  templateUrl: './cliente-crear-editar.component.html',
  styleUrls: ['./cliente-crear-editar.component.css'],
})
export class ClienteCrearEditarComponent implements OnInit {
  providerFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ClienteCrearEditarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    private _formBuilder: FormBuilder,
    private clientesService: ClientesService,
    private spinner: NgxSpinnerService
  ) {
    this.providerFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      nit: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('[0-9-]+$'),
        ],
      ],
      payTypeSunday: ['', Validators.required],
    });
    this.providerFormGroup.patchValue(this.data);
  }

  ngOnInit(): void {}

  saveUpdateClient() {
    this.providerFormGroup.markAllAsTouched();
    if (this.providerFormGroup.valid) {
      if (!this.data) this.insert();
      if (this.data) this.update();
    }
  }

  insert() {
    let add: AddCliente = {
      name: this.providerFormGroup.get('name')?.value,
      nit: this.providerFormGroup.get('nit')?.value,
      payTypeSunday: this.providerFormGroup.get('payTypeSunday')?.value,
    };

    this.spinner.show();
    this.clientesService.saveCliente(add).subscribe({
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
    let update: Cliente = {
      name: this.providerFormGroup.get('name')?.value,
      nit: this.providerFormGroup.get('nit')?.value,
      payTypeSunday: this.providerFormGroup.get('payTypeSunday')?.value,
      id: this.data.id,
    };

    this.spinner.show();
    this.clientesService.updateCliente(update).subscribe({
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

  validateFormatNit(event: any) {
    return Utiles.validateFormatNit(event);
  }
}
