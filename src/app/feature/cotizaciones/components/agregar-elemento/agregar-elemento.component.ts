import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ElementoType } from 'src/app/feature/catalogos/elementos/models/elemento';
import { ElementoService } from 'src/app/feature/catalogos/elementos/service/elemento.service';
import { ElementosService } from 'src/app/feature/elementos/service/elementos.service';
import Swal from 'sweetalert2';
import { ElementQuotationService } from '../../service/element-quotation.service';
import { ElementByProvider } from 'src/app/feature/catalogos/subcargos/models/subcargos';
import { ElementQuotation } from '../../models/elementQuotation';
import { SubcargosService } from 'src/app/feature/catalogos/subcargos/service/subcargos.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CotizacionesService } from '../../service/cotizaciones.service';
import { DecimalPipe } from '@angular/common';
import { startWith } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-agregar-elemento',
  templateUrl: './agregar-elemento.component.html',
  styleUrls: ['./agregar-elemento.component.css'],
})
export class AgregarElementoComponent implements OnInit {
  isInsertOrEditrRoute: boolean = false;
  action: string | undefined;
  titleButton: string;
  addElementoFormGroup: FormGroup;
  elementTypeList: ElementoType[] = [];
  elementProviderList: ElementByProvider[] = [];
  elementList: ElementByProvider[] = [];
  elementsQuotations: ElementQuotation[] = [];
  diferenciaMeses: number;
  esAdmin: boolean = false;
  esServicioCliente: boolean = false;
  esComercial: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AgregarElementoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private elementosService: ElementosService,
    private ElementoService: ElementoService,
    private spinner: NgxSpinnerService,
    private elementQuotationService: ElementQuotationService,
    private subcargosService: SubcargosService,
    private cdr: ChangeDetectorRef,
    private decimalPipe: DecimalPipe,
    private authService: AuthService
  ) {
    this.action = data.title;
    this.addElementoFormGroup = this._formBuilder.group({
      id: 0,
      quotationId: 0,
      elementId: [{ value: null, disabled: true }, Validators.required],
      elementName: [''],
      value: [null],
      depreciation: [0, [Validators.required, Validators.max(100)]],
      amount: 1,
      box: null,
      boxCostMonth: [0],
      transportCostDay: [null],
      transportCostMonth: [null],
      elementTypeId: [null, Validators.required],
    });

    if (data && data.diferenciaMeses) {
      this.addElementoFormGroup
        .get('depreciation')
        ?.setValue(data.diferenciaMeses);
    }

    this.customAreaAutenticada();
  }

  ngOnInit(): void {
    this.onAction();
    this.getElementType();
    this.cdr.detectChanges();

    if (this.action === 'editar' && this.data.data) {
      this.elementTypeId?.setValue(this.data.data.elementTypeId);
      this.getElement();
      this.addElementoFormGroup.patchValue({
        id: this.data.data.id,
        quotationId: this.data.data.quotationId,
        elementId: this.data.data.elementId,
        elementName: this.data.data.elementName,
        elementProviderName: this.data.data.elementProviderName,
        value: this.data.data.value,
        depreciation: this.data.data.depreciation,
        amount: this.data.data.amount,
        box: this.data.data.box,
        boxCostMonth: this.data.data.boxCostMonth,
        transportCostDay: this.data.data.transportCostDay,
        transportCostMonth: this.data.data.transportCostMonth,
        elementTypeId: this.data.data.elementTypeId,
        supplierId: this.data.data.supplierId,
      });
    }

    this.addElementoFormGroup
      .get('elementTypeId')!
      .valueChanges.pipe(
        startWith(this.addElementoFormGroup.get('elementTypeId')!.value ?? '')
      )
      .subscribe((value) => {
        const elementControl = this.addElementoFormGroup.get('elementId');
        if (value !== '') {
          elementControl?.enable();
        } else {
          elementControl?.disable();
        }
      });
  }

  customAreaAutenticada() {
    const jwt = this.authService.decodeJWT();
    this.esComercial = jwt.IsCommercial == 'True';
    this.esAdmin = jwt.IsCosts == 'True';
    if (!this.esAdmin) {
      this.esAdmin = jwt.IsSupport == 'True';
    }
    this.esServicioCliente = jwt.IsCustomerService == 'True';
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  clearValueField() {
    this.addElementoFormGroup.get('value')?.setValue(null);
  }

  getElementType(): void {
    this.ElementoService.getElementType().subscribe((res: ElementoType[]) => {
      this.elementTypeList = res.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
  }

  getElement(): void {
    this.subcargosService
      .getElementByProvider(this.elementTypeId?.value)
      .subscribe((res: any[]) => {
        this.elementList = res.sort((a, b) =>
          a.elementName > b.elementName ? 1 : -1
        );
      });
    this.clearValueField();
  }

  saveUpdateElementQuotation() {
    if (this.addElementoFormGroup.valid) {
      const selectedElement = this.elementList.find(
        (element) =>
          element.elementId === this.addElementoFormGroup.value.elementId
      );
      this.addElementoFormGroup
        .get('value')
        ?.setValue(this.addElementoFormGroup.value?.value);
      if (selectedElement) {
        selectedElement.depreciation = this.depreciation?.value;
        selectedElement.amount = this.amount?.value;
        selectedElement.box = this.box?.value;
        selectedElement.boxCostMonth = this.boxCostMonth?.value;
        selectedElement.transportCostDay = this.transportCostDay?.value;
        selectedElement.transportCostMonth = this.transportCostMonth?.value;
        selectedElement.elementTypeId = this.elementTypeId?.value;
        selectedElement.elementId = this.elementId?.value;
        selectedElement.unitPrice = this.value?.value;
        this.addElementoFormGroup.patchValue({
          elementName: selectedElement.elementName,
          elementTypeName: selectedElement.elementTypeName,
          supplierName: selectedElement.supplierName,
          supplierId: selectedElement.supplierId,
          elementId: selectedElement.elementId,
          value: selectedElement.value,
        });
      }
      const { elementTypeId, supplierId, elementId, ...newElementQuotation } =
        this.addElementoFormGroup.value;
      const newElementWithDepreciation = {
        ...newElementQuotation,
        depreciation: this.depreciation?.value,
        amount: this.amount?.value,
        value: this.value?.value,
      };
      this.elementsQuotations = [
        ...this.elementsQuotations,
        newElementWithDepreciation,
      ];
      if (this.action === 'agregar') {
        this.close(true, selectedElement, false);
      } else if (this.action === 'editar') {
        this.close(true, selectedElement, true);
      }
    } else {
      Alert.error(
        'Por favor, complete todos los campos requeridos correctamente'
      );
    }
  }

  onElementSelectionChange(element: any) {
    this.addElementoFormGroup.get('id')?.setValue(element.id);
    this.addElementoFormGroup.get('value')?.setValue(element.unitPrice);

    if (this.action === 'editar') {
      this.addElementoFormGroup.get('box')?.setValue('');
      this.addElementoFormGroup.get('boxCostMonth')?.setValue('');
      this.addElementoFormGroup.get('boxCostMonth')?.setValue('');
      this.addElementoFormGroup.get('transportCostDay')?.setValue('');
      this.addElementoFormGroup.get('transportCostMonth')?.setValue('');
    }
  }

  close(close: boolean, selectedElement?: ElementByProvider, isEdit?: boolean) {
    if (selectedElement) {
      this.dialogRef.close({
        close,
        elementsQuotations: this.elementsQuotations,
        selectedElement,
        isEdit: isEdit,
      });
    } else {
      this.dialogRef.close({
        close,
        elementsQuotations: this.elementsQuotations,
      });
    }
  }

  formatUnitPrice(unitPrice: number): string {
    return this.decimalPipe.transform(unitPrice, '1.0-0') ?? '';
  }

  onAction(): void {
    if (this.action === 'agregar') {
      this.titleButton = 'Guardar';
    } else if (this.action === 'editar') {
      this.titleButton = 'Guardar';
    }
  }

  get elementTypeId() {
    return this.addElementoFormGroup.get('elementTypeId');
  }

  get id() {
    return this.addElementoFormGroup.get('id');
  }

  get elementId() {
    return this.addElementoFormGroup.get('elementId');
  }

  get elementTypeName() {
    return this.addElementoFormGroup.get('elementTypeName');
  }

  get elementName() {
    return this.addElementoFormGroup.get('elementName');
  }

  get value() {
    return this.addElementoFormGroup.get('value');
  }
  get depreciation() {
    return this.addElementoFormGroup.get('depreciation');
  }
  get amount() {
    return this.addElementoFormGroup.get('amount');
  }
  get box() {
    return this.addElementoFormGroup.get('box');
  }
  get boxCostMonth() {
    return this.addElementoFormGroup.get('boxCostMonth');
  }
  get transportCostDay() {
    return this.addElementoFormGroup.get('transportCostDay');
  }
  get transportCostMonth() {
    return this.addElementoFormGroup.get('transportCostMonth');
  }
}
