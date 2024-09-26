import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom } from 'rxjs';
import { ElementProvider } from 'src/app/feature/catalogos/subcargos/models/subchargueElementType';
import { SubcargosService } from 'src/app/feature/catalogos/subcargos/service/subcargos.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { CrearEditarElementosComponent } from './crear-editar-elementos/crear-editar-elementos.component';
import {
  ElementProviderDto,
  InfoCostHiringDto,
  InfoElementsCommunicationDto,
  InfoElementsOtherDto,
  InfoElementsVehicleDto,
  InfoElementsWeaponDto,
  InfoResourcesPositionDto,
  InfoTestDto,
  InfoTrainingDto,
  InfoUniformDto,
  InfoVehicleDto,
  InfoWeaponDto,
} from 'src/app/feature/catalogos/subcargos/models/elementsProvider';
import { ElementypeElementService } from 'src/app/feature/cotizaciones/service/elementype-element.service';
import { ResponseDto } from 'src/app/models/responseDto';
import { ElementClassificationEnum } from 'src/app/helpers/enums';
import { MatTableDataSource } from '@angular/material/table';
import { CotizacionesService } from 'src/app/feature/cotizaciones/service/cotizaciones.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-elementos',
  templateUrl: './elementos.component.html',
  styleUrls: ['./elementos.component.css'],
})
export class ElementosComponent implements OnInit, AfterViewInit {
  @Input() infoTraining: InfoTrainingDto;
  @Input() infoTest: InfoTestDto;
  @Input() infoCostHiring: InfoCostHiringDto;
  @Input() infoUniform: InfoUniformDto;
  @Input() infoResourcesPosition: InfoResourcesPositionDto;
  @Input() infoElementsCommunication: InfoElementsCommunicationDto;
  @Input() infoWeapon: InfoWeaponDto;
  @Input() infoElementsWeapon: InfoElementsWeaponDto;
  @Input() infoVehicle: InfoVehicleDto;
  @Input() infoElementsVehicle: InfoElementsVehicleDto;
  @Input() infoElementsOther: InfoElementsOtherDto;
  @Input() subChargesQuotationId: number;

  idElementType: number;
  singularNameElementType: string;

  displayedColumns: string[] = [
    'element',
    'cost',
    'depreciation',
    'quantity',
    'acciones',
  ];
  dataSource: MatTableDataSource<ElementProviderDto> =
    new MatTableDataSource<ElementProviderDto>();
  listElementProviders: ElementProviderDto[] = [];
  elementProviders: ElementProvider[] = [];
  statusName: string;
  isStatusDisabled: boolean = true;
  depreciation: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private subcargosService: SubcargosService,
    private matDialog: MatDialog,
    private spinner: NgxSpinnerService,
    private elementypeElementService: ElementypeElementService,
    private cotizacionesService: CotizacionesService,
    private decimalPipe: DecimalPipe
  ) {}

  ngOnInit(): void {
    this.setData();

    if (this.mostrarCantidad()) {
      this.displayedColumns = [
        'element',
        'cost',
        'depreciation',
        'quantity',
        'acciones',
      ];
    } else {
      this.displayedColumns = ['element', 'cost', 'depreciation', 'acciones'];
    }

    this.statusName = this.cotizacionesService.getStatusName();
    this.updateStatusDisabled();

    this.cotizacionesService.currentDepreciation.subscribe((depreciation) => {
      this.depreciation = depreciation;
    });

    this.loadDataElement();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  updateStatusDisabled() {
    if (
      this.statusName === 'Enviada al Solicitante' ||
      this.statusName === 'Enviada al Cliente' ||
      this.statusName === 'Aprobada' ||
      this.statusName === 'Reemplazada' ||
      this.statusName === 'No Aprobada' ||
      this.statusName === 'Anulada'
    ) {
      this.isStatusDisabled = true;
    } else {
      this.isStatusDisabled = false;
    }
  }

  setDataElement(elements: ElementProviderDto[]) {
    this.dataSource.data = elements;
  }

  setData() {
    if (this.infoTraining) {
      this.idElementType = this.infoTraining.idElementType;
      this.singularNameElementType = this.infoTraining.singularNameElementType;
      this.listElementProviders = this.infoTraining.trainings;
      this.setDataElement(this.listElementProviders);
    }

    if (this.infoTest) {
      this.idElementType = this.infoTest.idElementType;
      this.singularNameElementType = this.infoTest.singularNameElementType;
      this.listElementProviders = this.infoTest.tests;
      this.setDataElement(this.listElementProviders);
    }

    if (this.infoCostHiring) {
      this.idElementType = this.infoCostHiring.idElementType;
      this.singularNameElementType =
        this.infoCostHiring.singularNameElementType;
      this.listElementProviders = this.infoCostHiring.costHirings;
      this.setDataElement(this.listElementProviders);
    }

    if (this.infoUniform) {
      this.idElementType = this.infoUniform.idElementType;
      this.singularNameElementType = this.infoUniform.singularNameElementType;
      this.listElementProviders = this.infoUniform.uniforms;
      this.setDataElement(this.listElementProviders);
    }

    if (this.infoResourcesPosition) {
      this.idElementType = this.infoResourcesPosition.idElementType;
      this.singularNameElementType =
        this.infoResourcesPosition.singularNameElementType;
      this.listElementProviders = this.infoResourcesPosition.resourcesPositions;
      this.setDataElement(this.listElementProviders);
    }

    if (this.infoElementsCommunication) {
      this.idElementType = this.infoElementsCommunication.idElementType;
      this.singularNameElementType =
        this.infoElementsCommunication.singularNameElementType;
      this.listElementProviders =
        this.infoElementsCommunication.elementsCommunications;
      this.setDataElement(this.listElementProviders);
    }

    if (this.infoWeapon) {
      this.idElementType = this.infoWeapon.idElementType;
      this.singularNameElementType = this.infoWeapon.singularNameElementType;
      this.listElementProviders = this.infoWeapon.weapons;
      this.setDataElement(this.listElementProviders);
    }

    if (this.infoElementsWeapon) {
      this.idElementType = this.infoElementsWeapon.idElementType;
      this.singularNameElementType =
        this.infoElementsWeapon.singularNameElementType;
      this.listElementProviders = this.infoElementsWeapon.weaponElements;
      this.setDataElement(this.listElementProviders);
    }

    if (this.infoVehicle) {
      this.idElementType = this.infoVehicle.idElementType;
      this.singularNameElementType = this.infoVehicle.singularNameElementType;
      this.listElementProviders = this.infoVehicle.vehicles;
      this.setDataElement(this.listElementProviders);
    }

    if (this.infoElementsVehicle) {
      this.idElementType = this.infoElementsVehicle.idElementType;
      this.singularNameElementType =
        this.infoElementsVehicle.singularNameElementType;
      this.listElementProviders = this.infoElementsVehicle.vehicleElements;
      this.setDataElement(this.listElementProviders);
    }

    if (this.infoElementsOther) {
      this.idElementType = this.infoElementsOther.idElementType;
      this.singularNameElementType =
        this.infoElementsOther.singularNameElementType;
      this.listElementProviders = this.infoElementsOther.otherElements;
      this.setDataElement(this.listElementProviders);
    }
  }

  edit(element: ElementProviderDto) {
    this.openDialog(element);
  }

  delete(element: ElementProviderDto) {
    Alert.questionConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.deleteDataElement(element.id);
      }
    });
  }

  async openDialog(element?: ElementProviderDto) {
    if (this.elementProviders.length > 0) {
      this.dialogResult(element);
    } else {
      try {
        this.spinner.show();

        switch (this.idElementType) {
          case ElementClassificationEnum.ArmasElementos:
            this.elementProviders = await lastValueFrom(
              this.subcargosService.getElementProviderByElementTypeIdWeapons(
                this.subChargesQuotationId,
                ElementClassificationEnum.Armas
              )
            );
            break;
          case ElementClassificationEnum.VehiculosElementos:
            this.elementProviders = await lastValueFrom(
              this.subcargosService.getElementProviderByElementTypeIdVehicles(
                this.subChargesQuotationId,
                ElementClassificationEnum.Vehiculos
              )
            );
            break;
          default:
            this.elementProviders = await lastValueFrom(
              this.subcargosService.getElementByProvider(this.idElementType)
            );
            break;
        }

        this.spinner.hide();
      } catch (error) {
        this.spinner.hide();
        console.error(error);
        Alert.error(
          'Ha ocurrido un error interno, por favor volverlo a intentar.'
        );
      }

      if (this.elementProviders.length > 0) {
        this.dialogResult(element);
      } else {
        switch (this.idElementType) {
          case ElementClassificationEnum.ArmasElementos:
            Alert.warning(
              'Por favor agregar un arma a la cotización y/o agregar elementos de armas al arma '
            );
            break;
          case ElementClassificationEnum.VehiculosElementos:
            Alert.warning(
              'Por favor agregar un vehículo a la cotización y/o agregar elementos de vehículos al vehiculo '
            );
            break;
          default:
            Alert.warning(
              'Por favor registrar primero los elementos de tipo ' +
                this.singularNameElementType
            );
            break;
        }
        Alert.warning(
          'Por favor registrar primero los elementos de tipo ' +
            this.singularNameElementType
        );
      }
    }
  }

  dialogResult(element?: ElementProviderDto) {
    const dialogRef = this.matDialog.open(CrearEditarElementosComponent, {
      width: '60%',
      data: {
        elementProviders: this.elementProviders,
        element: element,
        elementTypeName: this.singularNameElementType,
        idElementType: this.idElementType,
        subChargesQuotationId: this.subChargesQuotationId,
        depreciation: this.depreciation,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDataElement();
      }
    });
  }

  //metodos de consulta
  loadDataElement() {
    if (this.infoTraining) {
      this.getAllTrainingsByQuotationId();
    }

    if (this.infoTest) {
      this.getAllTestsByQuotationId();
    }

    if (this.infoCostHiring) {
      this.getAllCostHiringByQuotationId();
    }

    if (this.infoUniform) {
      this.getAllUniformsByQuotationId();
    }

    if (this.infoResourcesPosition) {
      this.getAllResourcesPositionByQuotationId();
    }

    if (this.infoElementsCommunication) {
      this.getAllElementsCommunicationByQuotationId();
    }

    if (this.infoWeapon) {
      this.getAllWeaponByQuotationId();
    }

    if (this.infoElementsWeapon) {
      this.getAllElementsWeaponByQuotationId();
    }

    if (this.infoVehicle) {
      this.getAllVehicleByQuotationId();
    }

    if (this.infoElementsVehicle) {
      this.getAllElementsVehicleByQuotationId();
    }

    if (this.infoElementsOther) {
      this.getAllElementsOtherByQuotationId();
    }
  }

  getAllTrainingsByQuotationId() {
    this.spinner.show();
    this.elementypeElementService
      .getAllTrainingsByQuotationId(this.subChargesQuotationId)
      .subscribe({
        next: (response: ResponseDto) => {
          this.listElementProviders = response.result as ElementProviderDto[];
          this.setDataElement(this.listElementProviders);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error(error);
          Alert.errorHttp(error);
        },
      });
  }

  getAllTestsByQuotationId() {
    this.spinner.show();
    this.elementypeElementService
      .getAllTestsByQuotationId(this.subChargesQuotationId)
      .subscribe({
        next: (response: ResponseDto) => {
          this.listElementProviders = response.result as ElementProviderDto[];
          this.setDataElement(this.listElementProviders);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error(error);
          Alert.errorHttp(error);
        },
      });
  }

  getAllCostHiringByQuotationId() {
    this.spinner.show();
    this.elementypeElementService
      .getAllCostHiringByQuotationId(this.subChargesQuotationId)
      .subscribe({
        next: (response: ResponseDto) => {
          this.listElementProviders = response.result as ElementProviderDto[];
          this.setDataElement(this.listElementProviders);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error(error);
          Alert.errorHttp(error);
        },
      });
  }

  getAllUniformsByQuotationId() {
    this.spinner.show();
    this.elementypeElementService
      .getAllUniformsByQuotationId(this.subChargesQuotationId)
      .subscribe({
        next: (response: ResponseDto) => {
          this.listElementProviders = response.result as ElementProviderDto[];
          this.setDataElement(this.listElementProviders);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error(error);
          Alert.errorHttp(error);
        },
      });
  }

  getAllResourcesPositionByQuotationId() {
    this.spinner.show();
    this.elementypeElementService
      .getAllResourcesPositionByQuotationId(this.subChargesQuotationId)
      .subscribe({
        next: (response: ResponseDto) => {
          this.listElementProviders = response.result as ElementProviderDto[];
          this.setDataElement(this.listElementProviders);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error(error);
          Alert.errorHttp(error);
        },
      });
  }

  getAllElementsCommunicationByQuotationId() {
    this.spinner.show();
    this.elementypeElementService
      .getAllElementsCommunicationByQuotationId(this.subChargesQuotationId)
      .subscribe({
        next: (response: ResponseDto) => {
          this.listElementProviders = response.result as ElementProviderDto[];
          this.setDataElement(this.listElementProviders);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error(error);
          Alert.errorHttp(error);
        },
      });
  }

  getAllWeaponByQuotationId() {
    this.spinner.show();
    this.elementypeElementService
      .getAllWeaponByQuotationId(this.subChargesQuotationId)
      .subscribe({
        next: (response: ResponseDto) => {
          this.listElementProviders = response.result as ElementProviderDto[];
          this.setDataElement(this.listElementProviders);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error(error);
          Alert.errorHttp(error);
        },
      });
  }

  getAllElementsWeaponByQuotationId() {
    this.spinner.show();
    this.elementypeElementService
      .getAllElementsWeaponByQuotationId(this.subChargesQuotationId)
      .subscribe({
        next: (response: ResponseDto) => {
          this.listElementProviders = response.result as ElementProviderDto[];
          this.setDataElement(this.listElementProviders);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error(error);
          Alert.errorHttp(error);
        },
      });
  }

  getAllVehicleByQuotationId() {
    this.spinner.show();
    this.elementypeElementService
      .getAllVehicleByQuotationId(this.subChargesQuotationId)
      .subscribe({
        next: (response: ResponseDto) => {
          this.listElementProviders = response.result as ElementProviderDto[];
          this.setDataElement(this.listElementProviders);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error(error);
          Alert.errorHttp(error);
        },
      });
  }

  getAllElementsVehicleByQuotationId() {
    this.spinner.show();
    this.elementypeElementService
      .getAllElementsVehicleByQuotationId(this.subChargesQuotationId)
      .subscribe({
        next: (response: ResponseDto) => {
          this.listElementProviders = response.result as ElementProviderDto[];
          this.setDataElement(this.listElementProviders);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error(error);
          Alert.errorHttp(error);
        },
      });
  }

  getAllElementsOtherByQuotationId() {
    this.spinner.show();
    this.elementypeElementService
      .getAllElementsOtherByQuotationId(this.subChargesQuotationId)
      .subscribe({
        next: (response: ResponseDto) => {
          this.listElementProviders = response.result as ElementProviderDto[];
          this.setDataElement(this.listElementProviders);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error(error);
          Alert.errorHttp(error);
        },
      });
  }

  //delete
  deleteDataElement(id: number) {
    if (this.infoTraining) {
      this.deleteTraining(id);
    }

    if (this.infoTest) {
      this.deleteTest(id);
    }

    if (this.infoCostHiring) {
      this.deleteCostHiring(id);
    }

    if (this.infoUniform) {
      this.deleteUniform(id);
    }

    if (this.infoResourcesPosition) {
      this.deleteResourcesPosition(id);
    }

    if (this.infoElementsCommunication) {
      this.deleteElementsCommunication(id);
    }

    if (this.infoWeapon) {
      this.deleteWeapon(id);
    }

    if (this.infoElementsWeapon) {
      this.deleteElementWeapon(id);
    }

    if (this.infoVehicle) {
      this.deleteVehicle(id);
    }

    if (this.infoElementsVehicle) {
      this.deleteElementsVehicle(id);
    }

    if (this.infoElementsOther) {
      this.deleteElementsOther(id);
    }

    this.loadDataElement();
  }

  // deleteElement(id: number) {
  //   this.listElementProviders = this.listElementProviders.filter(
  //     (x) => x.id != id
  //   );
  //   this.setDataElement(this.listElementProviders);
  // }

  deleteTraining(id: number) {
    this.spinner.show();
    this.elementypeElementService.deleteTraining(id).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          this.getAllTrainingsByQuotationId();
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

  deleteTest(id: number) {
    this.spinner.show();
    this.elementypeElementService.deleteTest(id).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          this.getAllTestsByQuotationId();
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

  deleteCostHiring(id: number) {
    this.spinner.show();
    this.elementypeElementService.deleteCostHiring(id).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          this.getAllCostHiringByQuotationId();
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

  deleteUniform(id: number) {
    this.spinner.show();
    this.elementypeElementService.deleteUniform(id).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          this.getAllUniformsByQuotationId();
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

  deleteResourcesPosition(id: number) {
    this.spinner.show();
    this.elementypeElementService.deleteResourcesPosition(id).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          this.getAllResourcesPositionByQuotationId();
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

  deleteElementsCommunication(id: number) {
    this.spinner.show();
    this.elementypeElementService.deleteElementsCommunication(id).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          this.getAllElementsCommunicationByQuotationId();
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

  deleteWeapon(id: number) {
    this.spinner.show();
    this.elementypeElementService.deleteWeapon(id).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          this.getAllWeaponByQuotationId();
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

  deleteElementWeapon(id: number) {
    this.spinner.show();
    this.elementypeElementService.deleteElementsWeapon(id).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
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

  deleteVehicle(id: number) {
    this.spinner.show();
    this.elementypeElementService.deleteVehicle(id).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          this.getAllVehicleByQuotationId();
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

  deleteElementsVehicle(id: number) {
    this.spinner.show();
    this.elementypeElementService.deleteElementsVehicle(id).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
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

  deleteElementsOther(id: number) {
    this.spinner.show();
    this.elementypeElementService.deleteElementsOther(id).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          this.getAllElementsOtherByQuotationId();
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
    switch (this.idElementType) {
      case ElementClassificationEnum.Capacitacion: {
        return true;
      }
      case ElementClassificationEnum.ExamenesHSE: {
        return true;
      }
      case ElementClassificationEnum.GastosContratacion: {
        return true;
      }
      case ElementClassificationEnum.Armas: {
        return true;
      }
      case ElementClassificationEnum.Vehiculos: {
        return true;
      }
      default: {
        return true;
      }
    }
  }

  formatUnitPrice(unitPrice: number): string {
    return this.decimalPipe.transform(unitPrice, '1.0-0') ?? '';
  }
}
