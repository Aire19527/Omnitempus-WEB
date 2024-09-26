import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementosService } from '../../service/elementos.service';
import { ElementoService } from 'src/app/feature/catalogos/elementos/service/elemento.service';
import { ElementoType } from 'src/app/feature/catalogos/elementos/models/elemento';
import { Providers } from 'src/app/feature/proveedores/models/proveedores';
import { NgxSpinnerService } from 'ngx-spinner';
import { Elemento } from '../../models/elementos';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-form-elementos',
  templateUrl: './form-elementos.component.html',
  styleUrls: ['./form-elementos.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class FormElementosComponent implements OnInit {
  action: string | undefined;
  elementoFormGroup: FormGroup;
  titleButton: string;
  supplierList: Providers[] = [];
  elementTypeList: ElementoType[] = [];
  elementList: Elemento[] = [];

  constructor(
    public dialogRef: MatDialogRef<FormElementosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private elementosService: ElementosService,
    private elementoService: ElementoService,
    private spinner: NgxSpinnerService
  ) {
    this.action = data.title;

    this.elementoFormGroup = this._formBuilder.group({
      id: 0,
      supplierId: ['', Validators.required],
      supplierName: [''],
      elementTypeId: [null, Validators.required],
      elementTypeName: [''],
      elementId: [{ value: null, disabled: true }, Validators.required],
      elementName: [''],
      code: [''],
      unitPrice: [null, [Validators.required]],
      updateDate: null,
      lastUnitPrice: null,
      currentPrice: null,
      percentage: null,
      isActive: true,
      distributionType: [''],
    });
  }

  ngOnInit(): void {
    this.onAction();
    this.setData();
    this.getSupplier();
    this.getElementType();


    this.elementoFormGroup.get('elementTypeId')!.valueChanges
    .pipe(startWith(this.elementoFormGroup.get('elementTypeId')!.value ?? ''))
    .subscribe(value => {
      const elementControl = this.elementoFormGroup.get('elementId');
      if (value !== '') { 
        elementControl?.enable();
      } else {
        elementControl?.disable();
      }
    });
  }

  setData() {
    if (this.data.data) {
      this.elementoFormGroup.patchValue(this.data.data);
      this.getElement();
    }
  }

  getSupplier() {
    this.elementosService.getSupplier().subscribe((res: Providers[]) => {
      this.supplierList = res.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
  }

  getElementType() {
    this.elementoService.getElementType().subscribe((res: ElementoType[]) => {
      this.elementTypeList = res.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
  }

  getElement() {
    this.elementosService
      .getElementByElementType(this.element?.value)
      .subscribe((res: Elemento[]) => {
        this.elementList = res.sort((a, b) => (a.name > b.name ? 1 : -1));
      });
  }

  saveUpdateElement() {
    this.elementoFormGroup.markAllAsTouched();
    if (this.elementoFormGroup.invalid) {
      return;
    }

    const unitPriceValue = this.unitPrice?.value?.toString();
    this.elementoFormGroup.patchValue({
      unitPrice: unitPriceValue,
    });

    if (this.action === 'crear') {
      this.spinner.show();
      this.elementosService
        .saveElemento(this.elementoFormGroup.value)
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
      this.elementosService
        .updateElemento(this.elementoFormGroup.value)
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

  onAction(): void {
    if (this.action === 'crear') {
      this.titleButton = 'Guardar';
    } else if (this.action === 'editar') {
      this.titleButton = 'Guardar';
    }
  }

  get element() {
    return this.elementoFormGroup.get('elementTypeId');
  }

  get unitPrice() {
    return this.elementoFormGroup.get('unitPrice');
  }
}
