import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementoType } from '../../../elementos/models/elemento';
import { ElementoService } from '../../../elementos/service/elemento.service';
import { SubcargosService } from '../../service/subcargos.service';
import { ElementByProvider } from '../../models/subcargos';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-form-elementos',
  templateUrl: './form-elementos.component.html',
  styleUrls: ['./form-elementos.component.css'],
})
export class FormElementosComponent implements OnInit {
  action: string | undefined;
  elementFormGroup: FormGroup;
  elementTypes: ElementoType[] = [];
  elementProviderList: any[] = [];
  elementSubchargesList: ElementByProvider[] = [];
  titleButton: string;
  enumLiquidationList: string[] = [];
  test: string;

  constructor(
    public dialogRef: MatDialogRef<FormElementosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private ElementoService: ElementoService,
    private subcargosService: SubcargosService,
    private spinner: NgxSpinnerService,
    private decimalPipe: DecimalPipe
  ) {
    this.action = data.title;

    this.elementFormGroup = this._formBuilder.group({
      id: 0,
      subChargesId: 0,
      subChargesName: [''],
      elementProviderId: 0,
      quantity: [null],
      elementTypeId: [{ value: null, disabled: this.isEditMode() },Validators.required],
      elementTypeName: [''],
      elementId:  [{ value: null, disabled: true }, Validators.required],
      elementName: [''],
      distributionType: [{ value: null, disabled: true }],
      supplierName: '',
      unitPrice: 0,
    });
  }

  ngOnInit(): void {
    this.onAction();
    this.setData();

    this.elementFormGroup.get('elementTypeId')!.valueChanges
    .pipe(startWith(this.elementFormGroup.get('elementTypeId')!.value ?? ''))
    .subscribe(value => {
      const elementControl = this.elementFormGroup.get('elementId');
      if (value !== '') { 
        elementControl?.enable();
      } else {
        elementControl?.disable();
      }
    });
  }

  setData() {
    this.subChargesId?.patchValue(this.data.data.subChargesId);
    if (this.data.data) {
      this.getElementType();
      this.elementFormGroup.patchValue(this.data.data);
      this.getElementByProvider();
    }
  }

  getElementType() {
    this.ElementoService.getElementType().subscribe((res: any[]) => {
      this.elementTypes = res.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
  }

  getElementByProvider() {
    this.subcargosService
      .getElementByProvider(this.elementTypeId?.value)
      .subscribe((res: any[]) => {
        this.elementProviderList = res.sort((a, b) =>
          a.name > b.name ? 1 : -1
        );
        this.elementProviderList.filter((e) => e.id == this.elementId);
      });
  }

  onElementSelectionChange(elementProvider: any) {
    if (elementProvider.distributionType === 'Puesto') {
      this.distributionType?.setValue(1);
    } else if (elementProvider.distributionType === 'Persona') {
      this.distributionType?.setValue(0);
    }
    this.elementFormGroup
      .get('elementProviderId')
      ?.setValue(elementProvider.id);
  }

  onClasificationSelectionChange() {
    this.getElementByProvider();
  }

  getEnumLiquidation() {
    this.subcargosService.getEnumLiquidation().subscribe((res) => {
      this.enumLiquidationList = res;
    });
  }

  saveUpdateSubChargesElements() {
    this.elementFormGroup.markAllAsTouched();
    if (this.elementFormGroup.invalid) {
      return;
    }

    const distributionTypeValue = this.distributionType?.value;
    const formValue = this.elementFormGroup.value;
    formValue.distributionType = distributionTypeValue;
    if (this.action === 'agregar') {
      this.spinner.show();
      this.subcargosService.saveSubChargesElements(formValue).subscribe({
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
      this.subcargosService.updateSubChargesElements(formValue).subscribe({
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
    if (this.action === 'agregar') {
      this.titleButton = 'Guardar';
    } else if (this.action === 'editar') {
      this.titleButton = 'Guardar';
    }
  }

  formatUnitPrice(unitPrice: number): string {
    return this.decimalPipe.transform(unitPrice, '1.0-0') ?? '';
  }

  isEditMode(): boolean {
    return this.action === 'editar';
  }

  isSaveMode(): boolean {
    return this.action === 'agregar';
  }

  get id() {
    return this.elementFormGroup.get('id');
  }

  get elementTypeId() {
    return this.elementFormGroup.get('elementTypeId');
  }

  get subChargesId() {
    return this.elementFormGroup.get('subChargesId');
  }

  get elementProviderId() {
    return this.elementFormGroup.get('elementProviderId');
  }
  get distributionType() {
    return this.elementFormGroup.get('distributionType');
  }
  get elementId() {
    return this.elementFormGroup.get('elementId');
  }
}
