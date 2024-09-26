import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  AddElementProviderDto,
  ElementProviderDto,
} from 'src/app/feature/catalogos/subcargos/models/elementsProvider';
import { ElementProvider } from 'src/app/feature/catalogos/subcargos/models/subchargueElementType';
import { ElementypeElementService } from 'src/app/feature/cotizaciones/service/elementype-element.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { BoxEnum, ElementClassificationEnum } from 'src/app/helpers/enums';
import { ResponseDto } from 'src/app/models/responseDto';

@Component({
  selector: 'app-crear-editar-elementos',
  templateUrl: './crear-editar-elementos.component.html',
  styleUrls: ['./crear-editar-elementos.component.css'],
})
export class CrearEditarElementosComponent implements OnInit {
  enumBox = BoxEnum;
  elementClassificationEnum = ElementClassificationEnum;
  elementFormGroup: FormGroup;

  box: number = 0;
  constructor(
    public dialogRef: MatDialogRef<CrearEditarElementosComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      element: ElementProviderDto;
      elementProviders: ElementProvider[];
      elementTypeName: string;
      idElementType: number;
      subChargesQuotationId: number;
      depreciation: number;
    },
    private _formBuilder: FormBuilder,
    private elementypeElementService: ElementypeElementService,
    private spinner: NgxSpinnerService
  ) {
    this.elementFormGroup = this._formBuilder.group({
      elementProviderId: ['', [Validators.required]],
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
        this.mostrarCantidad()
          ? [
              Validators.required,
              Validators.compose([Validators.min(0), Validators.max(100)]),
            ]
          : false,
      ],
      box: ['', this.isTypeArma() ? Validators.required : false],
      boxCostPerMonth: ['', [Validators.compose([Validators.min(1)])]],
      transportationCostDay: ['', [Validators.compose([Validators.min(1)])]],
      transportationCostMonth: ['', [Validators.compose([Validators.min(1)])]],
    });

    if (this.data.element) {
      this.box = this.data.element.box ?? 0;
      this.elementFormGroup.patchValue(this.data.element);
    }
  }
  ngOnInit(): void {}

  forGroup() {
    const elementProviderId =
      this.elementFormGroup.get('elementProviderId')?.value;
    const box = this.elementFormGroup.get('box')?.value;
    const cost = this.elementFormGroup.get('cost')?.value;
    const depreciation = this.elementFormGroup.get('depreciation')?.value;
    const quantity = this.elementFormGroup.get('quantity')?.value;

    this.elementFormGroup = this._formBuilder.group({
      elementProviderId: [elementProviderId, [Validators.required]],
      box: [box, this.isTypeArma() ? Validators.required : false],
      transportationCostDay: [null, [Validators.compose([Validators.min(1)])]],
      transportationCostMonth: [
        null,
        [Validators.compose([Validators.min(1)])],
      ],
      boxCostPerMonth: [null, [Validators.compose([Validators.min(1)])]],
      cost: [
        cost,
        [Validators.required, Validators.compose([Validators.min(1)])],
      ],
      depreciation: [
        depreciation,
        [
          Validators.required,
          Validators.compose([Validators.min(0), Validators.max(100)]),
        ],
      ],
      quantity: [
        quantity,
        this.mostrarCantidad()
          ? [
              Validators.required,
              Validators.compose([Validators.min(0), Validators.max(100)]),
            ]
          : false,
      ],
    });
  }

  isTypeArma() {
    if (this.data.idElementType == ElementClassificationEnum.Armas) {
      return true;
    } else {
      return false;
    }
  }

  isTypeOT() {
    if (this.box == this.enumBox.OT) {
      return true;
    } else {
      return false;
    }
  }

  isTypeCajilla() {
    if (this.box == this.enumBox.CajillaDeSeguridad) {
      return true;
    } else {
      return false;
    }
  }

  selectElementProviders() {
    const elementProviderId =
      this.elementFormGroup.get('elementProviderId')?.value;
    const elementProvider = this.data.elementProviders.find(
      (x) => x.id == elementProviderId
    );
    this.elementFormGroup.get('cost')?.setValue(elementProvider?.unitPrice);
  }

  selectBox() {
    this.box = this.elementFormGroup.get('box')?.value;
    this.forGroup();
  }

  saveUpdateElement() {
    if (this.data.element) {
      this.update();
    } else {
      this.add();
    }
  }

  update() {
    let element: ElementProviderDto;
    element = {
      id: this.data.element.id,
      element: this.data.element.element,
      supplier: this.data.element.supplier,
      elementProviderId: this.elementFormGroup.get('elementProviderId')?.value,
      subChargesQuotationId: this.data.element.subChargesQuotationId,
      quantity: this.elementFormGroup.get('quantity')?.value,
      cost: this.elementFormGroup.get('cost')?.value,
      depreciation: this.elementFormGroup.get('depreciation')?.value,
      box: this.data.element.box,
      boxCostPerMonth: this.data.element.boxCostPerMonth,
      transportationCostDay: this.data.element.transportationCostDay,
      transportationCostMonth: this.data.element.transportationCostMonth,
    };
    switch (this.data.idElementType) {
      case ElementClassificationEnum.Capacitacion: {
        this.updateTraining(element);
        break;
      }
      case ElementClassificationEnum.ExamenesHSE: {
        this.updateTest(element);
        break;
      }
      case ElementClassificationEnum.GastosContratacion: {
        this.updateCostHiring(element);
        break;
      }
      case ElementClassificationEnum.DotacionUniforme: {
        element.quantity = this.elementFormGroup.get('quantity')?.value;
        this.updateUniform(element);
        break;
      }
      case ElementClassificationEnum.DotacionPuesto: {
        element.quantity = this.elementFormGroup.get('quantity')?.value;
        this.updateResourcesPosition(element);
        break;
      }
      case ElementClassificationEnum.Comunicacion: {
        element.quantity = this.elementFormGroup.get('quantity')?.value;
        this.updateElementsCommunication(element);
        break;
      }
      case ElementClassificationEnum.Armas: {
        element.box = this.elementFormGroup.get('box')?.value;
        element.boxCostPerMonth =
          this.elementFormGroup.get('boxCostPerMonth')?.value ?? null;
        element.transportationCostDay =
          this.elementFormGroup.get('transportationCostDay')?.value ?? null;
        element.transportationCostMonth =
          this.elementFormGroup.get('transportationCostMonth')?.value ?? null;
        element.quantity = this.elementFormGroup.get('quantity')?.value ?? null;
        this.updateWeapon(element);
        break;
      }
      case ElementClassificationEnum.ArmasElementos: {
        element.quantity = this.elementFormGroup.get('quantity')?.value;
        this.updateElementsWeapon(element);
        break;
      }
      case ElementClassificationEnum.Vehiculos: {
        this.updateVehicle(element);
        break;
      }
      case ElementClassificationEnum.VehiculosElementos: {
        element.quantity = this.elementFormGroup.get('quantity')?.value;
        this.updateElementsVehicle(element);
        break;
      }
      case ElementClassificationEnum.Otro: {
        element.quantity = this.elementFormGroup.get('quantity')?.value;
        this.updateElementsOther(element);
        break;
      }
      default: {
        Alert.warning(
          'No existe el tipo de elemento seleccionado, por favor actualizar código fuente'
        );
        break;
      }
    }
  }

  //add
  add() {
    let addEntity: AddElementProviderDto = {
      elementProviderId: this.elementFormGroup.get('elementProviderId')?.value,
      cost: this.elementFormGroup.get('cost')?.value,
      depreciation: this.elementFormGroup.get('depreciation')?.value,
      subChargesQuotationId: this.data.subChargesQuotationId,
      quantity: 1,
    };
    switch (this.data.idElementType) {
      case ElementClassificationEnum.Capacitacion: {
        this.addTraining(addEntity);
        break;
      }
      case ElementClassificationEnum.ExamenesHSE: {
        this.addTest(addEntity);
        break;
      }
      case ElementClassificationEnum.GastosContratacion: {
        this.addCostHiring(addEntity);
        break;
      }
      case ElementClassificationEnum.DotacionUniforme: {
        addEntity.quantity = this.elementFormGroup.get('quantity')?.value;
        this.addUniform(addEntity);
        break;
      }
      case ElementClassificationEnum.DotacionPuesto: {
        addEntity.quantity = this.elementFormGroup.get('quantity')?.value;
        this.addResourcesPosition(addEntity);
        break;
      }
      case ElementClassificationEnum.Comunicacion: {
        addEntity.quantity = this.elementFormGroup.get('quantity')?.value;
        this.addElementsCommunication(addEntity);
        break;
      }
      case ElementClassificationEnum.Armas: {
        addEntity.box = this.elementFormGroup.get('box')?.value;
        addEntity.boxCostPerMonth =
          this.elementFormGroup.get('boxCostPerMonth')?.value ?? null;
        addEntity.transportationCostDay =
          this.elementFormGroup.get('transportationCostDay')?.value ?? null;
        addEntity.transportationCostMonth =
          this.elementFormGroup.get('transportationCostMonth')?.value ?? null;
        this.addWeapon(addEntity);
        break;
      }
      case ElementClassificationEnum.ArmasElementos: {
        addEntity.quantity = this.elementFormGroup.get('quantity')?.value;
        this.addElementsWeapon(addEntity);
        break;
      }
      case ElementClassificationEnum.Vehiculos: {
        this.addVehicle(addEntity);
        break;
      }
      case ElementClassificationEnum.VehiculosElementos: {
        addEntity.quantity = this.elementFormGroup.get('quantity')?.value;
        this.addElementsVehicle(addEntity);
        break;
      }
      case ElementClassificationEnum.Otro: {
        addEntity.quantity = this.elementFormGroup.get('quantity')?.value;
        this.addElementsOther(addEntity);
        break;
      }
      default: {
        Alert.warning(
          'No existe el tipo de elemento seleccionado, por favor actualizar código fuente'
        );
        break;
      }
    }
  }

  addTraining(model: AddElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.addTraining(model).subscribe({
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

  addTest(model: AddElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.addTest(model).subscribe({
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

  addCostHiring(model: AddElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.addCostHiring(model).subscribe({
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

  addUniform(model: AddElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.addUniform(model).subscribe({
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

  addResourcesPosition(model: AddElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.addResourcesPosition(model).subscribe({
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

  addElementsCommunication(model: AddElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.addElementsCommunication(model).subscribe({
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

  addWeapon(model: AddElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.addWeapon(model).subscribe({
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

  addElementsWeapon(model: AddElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.addElementsWeapon(model).subscribe({
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

  addVehicle(model: AddElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.addVehicle(model).subscribe({
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

  addElementsVehicle(model: AddElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.addElementsVehicle(model).subscribe({
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

  addElementsOther(model: AddElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.addElementsOther(model).subscribe({
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

  //update
  updateTraining(model: ElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.updateTraining(model).subscribe({
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

  updateTest(model: ElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.updateTest(model).subscribe({
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

  updateCostHiring(model: ElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.updateCostHiring(model).subscribe({
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

  updateUniform(model: ElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.updateUniform(model).subscribe({
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

  updateResourcesPosition(model: ElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.updateResourcesPosition(model).subscribe({
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

  updateElementsCommunication(model: ElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.updateElementsCommunication(model).subscribe({
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

  updateWeapon(model: ElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.updateWeapon(model).subscribe({
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

  updateElementsWeapon(model: ElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.updateElementsWeapon(model).subscribe({
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

  updateVehicle(model: ElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.updateVehicle(model).subscribe({
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

  updateElementsVehicle(model: ElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.updateElementsVehicle(model).subscribe({
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

  updateElementsOther(model: ElementProviderDto) {
    this.spinner.show();
    this.elementypeElementService.updateElementsOther(model).subscribe({
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

  //mostrar datos
  mostrarCantidad() {
    switch (this.data.idElementType) {
      case ElementClassificationEnum.Capacitacion: {
        return false;
      }
      case ElementClassificationEnum.ExamenesHSE: {
        return false;
      }
      case ElementClassificationEnum.GastosContratacion: {
        return false;
      }
      case ElementClassificationEnum.Armas: {
        return false;
      }
      case ElementClassificationEnum.Vehiculos: {
        return false;
      }
      default: {
        return true;
      }
    }
  }
}
