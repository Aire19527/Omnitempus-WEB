import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cotizaciones, Request } from '../../models/cotizaciones';
import { AgregarElementoComponent } from '../agregar-elemento/agregar-elemento.component';
import { AgregarPolizaComponent } from '../agregar-poliza/agregar-poliza.component';
import { CotizacionesService } from '../../service/cotizaciones.service';
import { BusinessLines } from 'src/app/feature/catalogos/lineas-negocio/models/lineasNegocio';
import { LineasNegocioService } from 'src/app/feature/catalogos/lineas-negocio/service/lineas-negocio.service';
import { ClientesService } from 'src/app/feature/clientes/service/clientes.service';
import { Cliente } from 'src/app/feature/clientes/models/clientes';
import { Policy } from '../../models/policy';
import { ElementQuotation } from '../../models/elementQuotation';
import { MatSort } from '@angular/material/sort';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { SteppersService } from '../../service/steppers.service';
import { DecimalPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-area-costos',
  templateUrl: './area-costos.component.html',
  styleUrls: ['./area-costos.component.css'],
})
export class AreaCostosComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild(MatPaginator) policyPaginator: MatPaginator | null;
  @ViewChild(MatSort) sortPolicy: MatSort | null;
  @ViewChild('elementPaginator') elementPaginator: MatPaginator | null;
  @ViewChild('table2', { read: MatSort }) elementSort!: MatSort | null;
  @ViewChild('stepper') private stepper: MatStepper;
  @Input() statusName: string | undefined;
  areaCostoFormGroup: FormGroup;
  polizaFormGroup: FormGroup;
  action: string | undefined;
  isInsertOrEditrRoute: boolean;
  displayedColumnsPoliza = ['policyName', 'percentage', 'acciones'];
  displayedColumnsElement = [
    'elementTypeName',
    'elementName',
    'elementProviderName',
    'currentPrice',
    'depreciation',
    'amount',
    'acciones',
  ];
  changeUrl: boolean = false;
  bussinesLinesList: BusinessLines[] = [];
  customerList: Cliente[] = [];
  routeId: string;
  cotizacionList: Cotizaciones[] = [];
  requestsList: Request[] = [];
  elementsQuotations: ElementQuotation[] = [];
  quotationPolicy: Policy[] = [];
  costsParametersList: any[] = [];
  elementQuotation: number;
  policyQuotation: number;
  selectedRequestId: number | null = null;
  isStatusDisabled: boolean = false;
  previousStepIndex: number = 0;
  dataSourceElement!: MatTableDataSource<ElementQuotation>;
  dataSourcePolicy!: MatTableDataSource<any>;
  savingQuotation: boolean = false;
  updateQuotation: boolean = false;
  starServiceDateDisabled: boolean = false;
  quotationId: number;
  lastRequestNumberId: number | undefined;
  changeStatusId: number;
  depreciacion: number;
  nameOffert: string;
  numberStepper: number;
  isFitLast: boolean = false;

  esAdmin: boolean = false;
  esServicioCliente: boolean = false;
  esComercial: boolean = false;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private _formBuilder: FormBuilder,
    private ctrlStepper: FormGroupDirective,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private matDialog: MatDialog,
    private cotizacionesService: CotizacionesService,
    private lineasNegocioService: LineasNegocioService,
    private clientesService: ClientesService,
    private router: Router,
    private steppersService: SteppersService,
    private cdr: ChangeDetectorRef,
    private decimalPipe: DecimalPipe,
    private authService: AuthService
  ) {
    this.customAreaAutenticada();
    this.OnAction();
  }

  ngOnInit(): void {
    this.customFormGroup();
    this.getQuotationById();
    this.getBussinesLines();
    this.getcustomer();
    this.getRequestsNumber();
    this.updateStatusDisabled();

    this.dataSourcePolicy = new MatTableDataSource(this.quotationPolicy);
    this.dataSourceElement = new MatTableDataSource(this.elementsQuotations);

    this.areaCostoFormGroup
      .get('contractDateStart')
      ?.valueChanges.subscribe((newDate: Date) => {
        this.updateStarServiceDate(newDate);
        this.areaCostoFormGroup.get('starServiceDate')?.setValue(newDate);
        this.areaCostoFormGroup
          .get('starServiceDate')
          ?.disable({ emitEvent: false });
      });

    this.areaCostoFormGroup.get('customersId')?.valueChanges.subscribe(() => {
      this.disableFields();
    });

    this.areaCostoFormGroup
      .get('prospectusName')
      ?.valueChanges.subscribe(() => {
        this.disableFields();
      });

    this.areaCostoFormGroup.get('statusName')?.valueChanges.subscribe(() => {
      this.updateStatusDisabled();
    });

    this.steppersService.stepperChangedArea$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((index) => {
        if (index === 1) {
          this.saveUpdateCosts(false);
          const fechaInicio =
            this.areaCostoFormGroup.get('contractDateStart')?.value;
          const fechaFin =
            this.areaCostoFormGroup.get('contractDateEnd')?.value;
          if (fechaInicio && fechaFin) {
            this.calculateDifferenceMonth(
              new Date(fechaInicio),
              new Date(fechaFin)
            );
          }
        }
      });

    this.cotizacionesService.quotationId$.subscribe((id) => {
      if (id) {
        this.quotationId = id;
        this.areaCostoFormGroup.get('id')?.setValue(this.quotationId);
      }
    });

    this.nameOffert = this.cotizacionesService.getNamOffert();
    this.cotizacionesService.namOffert$.subscribe((nameOffert) => {
      this.nameOffert = nameOffert;
      this.areaCostoFormGroup.get('offerCode')?.setValue(this.nameOffert);
    });

    this.ctrlStepper.form &&
      this.ctrlStepper.form.addControl(
        'area-costos-form',
        this.areaCostoFormGroup
      );
    if (!this.routeId) {
      this.getCostsQuotationParameters();
    }
  }

  customFormGroup() {
    this.areaCostoFormGroup = this._formBuilder.group({
      id: 0,
      isFitLast: [null, Validators.required],
      requestNumber: [null, Validators.required],
      customersId: [null, this.esServicioCliente ? Validators.required : false],
      prospectusName: [null, this.esComercial ? Validators.required : false],
      sundayPayment: null,
      bussinesLineId: [null, Validators.required],
      contractDateStart: ['', Validators.required],
      contractDateEnd: ['', Validators.required],
      starServiceDate: ['', Validators.required],
      pay31Day: [null, Validators.required],
      law50: [null, Validators.required],
      reinvestment: [null, Validators.required],
      elementRequired: [null, Validators.required],
      aditionalHoursMargin: [null, [Validators.required, Validators.max(100)]],
      commission: [null, [Validators.required, Validators.max(100)]],
      indirectCosts: [null, [Validators.required, Validators.max(100)]],
      gyaCosts: [null, [Validators.required, Validators.max(100)]],
      industryCommerce: [null, [Validators.required, Validators.max(100)]],
      observations: [''],
      statusId: 0,
      statusName: [''],
      applicationRegistrationDate: null,
      offerCode: [''],
      fitLastRequestNumber: [''],
      depreciation: 0,
      quotationPolicy: null,
      elementsQuotations: null,
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

  onClickStepper1() {
    this.steppersService.stepperChangedArea(1);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('statusName' in changes) {
      this.updateStatusDisabled();
    }
  }

  updateStatusDisabled() {
    const statusName = this.areaCostoFormGroup.get('statusName')?.value;
    this.isStatusDisabled =
      statusName === 'Enviada al Solicitante' ||
      statusName === 'Enviada al Cliente' ||
      statusName === 'Aprobada' ||
      statusName === 'Reemplazada' ||
      statusName === 'No Aprobada' ||
      statusName === 'Anulada';
    this.disableFieldsBystatus();
  }

  disableFieldsBystatus() {
    const statusName = this.areaCostoFormGroup.get('statusName')?.value;
    const controlsToDisable = [
      'requestNumber',
      'applicationRegistrationDate',
      'aditionalHoursMargin',
      'starServiceDate',
      'commission',
      'indirectCosts',
      'gyaCosts',
      'industryCommerce',
      'prospectusName',
      'observations',
    ];

    controlsToDisable.forEach((controlName) => {
      const control = this.areaCostoFormGroup.get(controlName);
      if (control) {
        if (
          statusName === 'Enviada al Solicitante' ||
          statusName === 'Enviada al Cliente' ||
          statusName === 'Aprobada' ||
          statusName === 'Reemplazada' ||
          statusName === 'No Aprobada' ||
          statusName === 'Anulada'
        ) {
          control.disable({ emitEvent: false });
        } else {
          control.enable({ emitEvent: false });
        }
      }
    });
  }

  getCostsQuotationParameters() {
    this.cotizacionesService
      .getCostsQuotationParameters()
      .subscribe((res: any[]) => {
        this.costsParametersList = res;
        this.assignFieldParameters();
      });
  }

  getRequestsNumber() {
    this.cotizacionesService.getRequestsNumber().subscribe((res: Request[]) => {
      this.requestsList = res;
      if (this.routeId) {
        const fitLastRequestNumber = this.areaCostoFormGroup.get(
          'fitLastRequestNumber'
        )?.value;
        this.requestsList.forEach((request) => {
          if (request.requestNumber === fitLastRequestNumber) {
            this.areaCostoFormGroup.get('requestNumber')?.setValue(request.id);
          }
        });
      }
    });
  }

  getBussinesLines() {
    this.lineasNegocioService
      .getBusinessLines()
      .subscribe((res: BusinessLines[]) => {
        this.bussinesLinesList = res.sort((a, b) => (a.name > b.name ? 1 : -1));
      });
  }

  getcustomer() {
    this.clientesService.getCustomer().subscribe((res: Cliente[]) => {
      this.customerList = res;
    });
  }

  getQuotationById(): void {
    if (this.routeId) {
      this.cotizacionesService.getQuotationById(this.routeId).subscribe({
        next: (res: any) => {
          this.areaCostoFormGroup.patchValue({
            ...res,
          });
          this.quotationPolicy = res.quotationPolicy;
          this.elementsQuotations = res.elementsQuotations;
          this.getQuotationPolicy();
          this.getQuotationElement();
          this.getRequestsNumber();
          const contractDateStart = res.contractDateStart;
          if (contractDateStart) {
            this.areaCostoFormGroup.get('starServiceDate')?.disable();
          } else {
            this.areaCostoFormGroup.get('starServiceDate')?.enable();
          }
          const customersIdValue =
            this.areaCostoFormGroup.get('customersId')?.value;
          if (customersIdValue) {
            this.areaCostoFormGroup.get('prospectusName')?.disable();
          }
        },
      });
    }
  }

  onSolicitudAnterior(event: any) {
    this.isFitLast = event.value;
    const inputControl = this.areaCostoFormGroup.get('requestNumber');
    if (this.isFitLast) {
      inputControl?.setValidators([Validators.required]);
    } else {
      inputControl?.clearValidators();
    }
    inputControl?.updateValueAndValidity();
  }

  onRequestNumberChange(event: any) {
    const selectedRequestId = event.value;
    if (selectedRequestId) {
      this.spinner.show();
      this.cotizacionesService.getQuotationById(selectedRequestId).subscribe({
        next: (res: any) => {
          this.areaCostoFormGroup.patchValue({
            isFitLast: true,
            contractDateStart: res.contractDateStart,
            contractDateEnd: res.contractDateEnd,
            prospectusName: res.prospectusName,
            customersId: res.customersId,
            aditionalHoursMargin: res.aditionalHoursMargin,
            sundayPayment: res.sundayPayment,
            bussinesLineId: res.bussinesLineId,
            reinvestment: res.reinvestment,
            commission: res.commission,
            indirectCosts: res.indirectCosts,
            gyaCosts: res.gyaCosts,
            industryCommerce: res.industryCommerce,
            pay31Day: res.pay31Day,
            law50: res.law50,
            applicationRegistrationDate: res.applicationRegistrationDate,
            elementRequired: res.elementRequired,
            observations: res.observations,
            quotationPolicy: res.quotationPolicy,
            elementsQuotations: res.elementsQuotations,
          });
          this.areaCostoFormGroup.updateValueAndValidity();
          this.getQuotationElement();
          this.getQuotationPolicy();
          this.spinner.hide();
          this.areaCostoFormGroup
            .get('fitLastRequestNumber')
            ?.setValue(res.requestNumber);
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
      this.areaCostoFormGroup.value;
    }
  }

  onCustomerSelectionChange(Customer: any) {
    if (Customer.payTypeSunday === 'OT') {
      this.sundayPayment?.setValue(0);
    } else if (Customer.payTypeSunday === 'Ajustado') {
      this.sundayPayment?.setValue(1);
    }
  }

  saveUpdateCosts(goToBack: boolean) {
    this.areaCostoFormGroup.markAllAsTouched();
    if (this.areaCostoFormGroup.invalid) {
      return;
    }

    const depreciation = this.areaCostoFormGroup.get('depreciation')?.value;
    if (this.isInsertOrEditrRoute) {
      this.updateCosts(goToBack);
    } else {
      this.saveCosts(goToBack);
    }

    if (!goToBack) {
      this.updateDepreciationElements(depreciation);
    }
  }

  updateDepreciationElements(oldDedpreciation: number) {
    if (this.elementsQuotations.length > 0) {
      const contractDateStart = new Date(
        this.areaCostoFormGroup.get('contractDateStart')?.value
      );
      const contractDateEnd = new Date(
        this.areaCostoFormGroup.get('contractDateEnd')?.value
      );
      const numberDepreciation = this.getMonthDifference(
        contractDateStart,
        contractDateEnd
      );

      if (numberDepreciation != oldDedpreciation) {
        this.elementsQuotations.forEach((x) => {
          x.depreciation = numberDepreciation;
        });
        this.getQuotationElement();
      }
    }
  }

  getMonthDifference(startDate: Date, endDate: Date): number {
    const monthsApart =
      12 * (startDate.getFullYear() - endDate.getFullYear()) +
      startDate.getMonth() -
      endDate.getMonth();
    return Math.abs(monthsApart);
  }

  saveCosts(goToBack: boolean) {
    if (this.savingQuotation) {
      return;
    }
    if (this.routeId && this.routeId !== '') {
      return;
    }

    const formData = this.areaCostoFormGroup.value;
    const contractDateStart = new Date(formData.contractDateStart);
    const selectedStarServiceDate = new Date(contractDateStart);
    const contractDateEnd = new Date(formData.contractDateEnd);
    const selectedapplicationRegistrationDate = new Date(
      formData.applicationRegistrationDate
    );
    const formattedContractDateStart = contractDateStart.toISOString();
    const formattedStarServiceDate = selectedStarServiceDate.toISOString();
    const formattedContractDateEnd = contractDateEnd.toISOString();
    const formattedapplicationRegistrationDate =
      selectedapplicationRegistrationDate.toISOString();

    formData.contractDateStart = formattedContractDateStart;
    formData.starServiceDate = formattedStarServiceDate;
    formData.contractDateEnd = formattedContractDateEnd;
    formData.applicationRegistrationDate = formattedapplicationRegistrationDate;
    formData.requestNumber = '';
    formData.statusId = this.cotizacionesService.getStatusId();

    this.spinner.show();
    this.areaCostoFormGroup.get('depreciation')?.setValue(this.depreciacion);
    this.areaCostoFormGroup.get('offerCode')?.setValue(this.nameOffert);
    this.savingQuotation = true;
    this.cotizacionesService.saveQuotation(formData).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          this.cotizacionesService.setStatusId(response.result.statusId);
          this.cotizacionesService.setQuotationId(response.result.id);
          if (formData.id === 0) {
            Alert.warning(
              'El código de solicitud es ' + response.result.requestNumber
            ).then(() => {
              Alert.toastSWMessage('success', response.message);
              goToBack && this.goBack();
              this.cotizacionesService.setNamRequest(
                response.result.requestNumber
              );
              this.cotizacionesService.setStatusName('Borrador');
            });
          } else {
            Alert.warning(
              'En caso de haber modificado información básica, pólizas y/o elementos, se debe recalcular los costos para cada uno de los puestos'
            ).then(() => {
              Alert.toastSWMessage('success', response.message);
              goToBack && this.goBack();
            });
          }
          this.cotizacionesService.notifyQuotationId(response.result.id);
        } else {
          Alert.toastSWMessage('warning', response.message);
        }
        this.spinner.hide();
        this.savingQuotation = false;
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
        this.savingQuotation = false;
      },
    });
  }

  updateCosts(goToBack: boolean) {
    if (this.updateQuotation) {
      return;
    }
    if (!this.routeId && this.routeId === '') {
      return;
    }

    const formData = this.areaCostoFormGroup.value;
    const contractDateStart = new Date(formData.contractDateStart);
    const selectedStarServiceDate = new Date(contractDateStart);
    const contractDateEnd = new Date(formData.contractDateEnd);
    const selectedapplicationRegistrationDate = new Date(
      formData.applicationRegistrationDate
    );
    const formattedContractDateStart = contractDateStart.toISOString();
    const formattedStarServiceDate = selectedStarServiceDate.toISOString();
    const formattedContractDateEnd = contractDateEnd.toISOString();
    const formattedapplicationRegistrationDate =
      selectedapplicationRegistrationDate.toISOString();

    formData.contractDateStart = formattedContractDateStart;
    formData.starServiceDate = formattedStarServiceDate;
    formData.contractDateEnd = formattedContractDateEnd;
    formData.applicationRegistrationDate = formattedapplicationRegistrationDate;
    formData.requestNumber = '';

    this.spinner.show();
    this.updateQuotation = true;
    this.cotizacionesService.updateQuotation(formData).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          if (this.inValidStatus()) {
            Alert.warning(
              'En caso de haber modificado información básica, pólizas y/o elementos, se debe recalcular los costos para cada uno de los puestos'
            ).then(() => {
              Alert.toastSWMessage('success', response.message);
              goToBack && this.goBack();
              this.cotizacionesService.notifyQuotationId(response.result.id);
            });
          }
        } else {
          Alert.toastSWMessage('warning', response.message);
        }
        this.spinner.hide();
        this.updateQuotation = false;
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
        this.updateQuotation = false;
      },
    });
  }

  inValidStatus(): boolean {
    return !(
      this.statusName === 'Aprobada' ||
      this.statusName === 'No Aprobada' ||
      this.statusName === 'Reemplazada' ||
      this.statusName === 'Anulada' ||
      this.statusName === 'Enviada al Cliente' ||
      this.statusName === 'Enviada al Solicitante'
    );
  }

  calculateDifferenceMonth(fechaInicio: Date, fechaFin: Date): number {
    const diferenciaEnMilisegundos = Math.abs(
      fechaFin.getTime() - fechaInicio.getTime()
    );
    const diferenciaEnMeses =
      diferenciaEnMilisegundos / (1000 * 60 * 60 * 24 * 30);
    const diferencia = Math.floor(diferenciaEnMeses);

    this.depreciacion = diferencia;
    this.areaCostoFormGroup.get('depreciation')?.setValue(diferencia);

    this.cotizacionesService.changeDepreciation(diferencia);
    return diferencia;
  }

  getQuotationElement() {
    if (this.dataSourceElement) {
      this.dataSourceElement.data = this.elementsQuotations;
      this.elementQuotation = this.elementsQuotations.length;
      this.dataSourceElement.paginator = this.elementPaginator;
      this.dataSourceElement.sort = this.elementSort;
    }
  }

  getQuotationPolicy() {
    if (this.dataSourcePolicy) {
      this.dataSourcePolicy.data = this.quotationPolicy;
      this.policyQuotation = this.quotationPolicy.length;
      this.dataSourcePolicy.paginator = this.policyPaginator;
      this.dataSourcePolicy.sort = this.sortPolicy;
    }
  }

  assignFieldParameters() {
    const fields = [
      'Comisión',
      'Costos indirectos',
      'Costos G&A',
      'Industria y comercio',
      'Margen horas adicionales',
    ];
    fields.forEach((field) => {
      const parameter = this.costsParametersList.find(
        (param) => param.parameter === field
      );
      if (field === 'Comisión') {
        this.areaCostoFormGroup.get('commission')?.setValue(parameter.value);
      } else if (field === 'Costos indirectos') {
        this.areaCostoFormGroup.get('indirectCosts')?.setValue(parameter.value);
      } else if (field === 'Costos G&A') {
        this.areaCostoFormGroup.get('gyaCosts')?.setValue(parameter.value);
      } else if (field === 'Industria y comercio') {
        this.areaCostoFormGroup
          .get('industryCommerce')
          ?.setValue(parameter.value);
      } else {
        this.areaCostoFormGroup
          .get('aditionalHoursMargin')
          ?.setValue(parameter.value);
      }
    });
  }

  openDialogElement(
    action: string,
    data?: ElementQuotation,
    numberPosition?: number
  ): void {
    this.changeUrl = false;
    const fechaInicio = new Date(
      this.areaCostoFormGroup.value.contractDateStart
    );
    const fechaFin = new Date(this.areaCostoFormGroup.value.contractDateEnd);
    const diferenciaMeses = this.calculateDifferenceMonth(
      fechaInicio,
      fechaFin
    );
    const numberPositionElement = numberPosition;
    const dialogRef = this.matDialog.open(AgregarElementoComponent, {
      width: '60%',
      data: {
        title: action,
        data: data,
        diferenciaMeses: diferenciaMeses,
        quotationId: this.quotationId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.close) {
        result.selectedElement.elementProviderName =
          result.selectedElement.supplierName;
        result.selectedElement.elementTypeName =
          result.selectedElement.elementTypeName;
        result.selectedElement.value = result.selectedElement.unitPrice;
        if (
          !result.isEdit &&
          this.elementsQuotations.some(
            (res) =>
              res.elementId === result.selectedElement.elementId &&
              res.supplierId === result.selectedElement.supplierId
          )
        ) {
          Alert.warning('El elemento ya está agregado.');
        } else if (result.isEdit) {
          const existingElementIndex = this.elementsQuotations.findIndex(
            (element) =>
              element.elementId === result.selectedElement.elementId &&
              element.supplierId === result.selectedElement.supplierId
          );
          if (
            existingElementIndex !== -1 &&
            existingElementIndex !== numberPositionElement
          ) {
            Alert.warning('El elemento ya está agregado.');
          } else {
            if (typeof numberPositionElement === 'number') {
              this.elementsQuotations[numberPositionElement] =
                result.selectedElement;
            }
            this.dataSourceElement.data = this.elementsQuotations;
            Alert.toastSWMessage(
              'success',
              'Registro actualizado satisfactoriamente.'
            );
          }
        } else {
          this.changeUrl = result.close;
          this.elementsQuotations.push(result.selectedElement);
          this.areaCostoFormGroup
            .get('elementsQuotations')
            ?.setValue(this.elementsQuotations);
          this.dataSourceElement.data = this.elementsQuotations;
          this.getQuotationElement();
        }
      }
    });
  }

  openDialogPoliza(
    action: string,
    data?: Policy,
    numberPosition?: number
  ): void {
    this.changeUrl = false;
    const numberPositionPolicy = numberPosition;
    const dialogRef = this.matDialog.open(AgregarPolizaComponent, {
      width: '60%',
      data: { title: action, data: data },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.close) {
        result.selectedPolicy.policyName = result.selectedPolicy.name;
        result.selectedPolicy.policyId = result.selectedPolicy.id;
        result.selectedPolicy.percentage = result.selectedPolicy.percentage;
        if (
          !result.isEdit &&
          this.quotationPolicy.some(
            (res) => res.policyId === result.selectedPolicy.id
          )
        ) {
          Alert.warning('La póliza ya está agregada.');
        } else if (result.isEdit) {
          const existingPolicyIndex = this.quotationPolicy.findIndex(
            (policy) => policy.policyId === result.selectedPolicy.id
          );

          if (
            existingPolicyIndex !== -1 &&
            existingPolicyIndex !== numberPositionPolicy
          ) {
            Alert.warning('La póliza ya está agregada.');
          } else {
            if (typeof numberPositionPolicy === 'number') {
              this.quotationPolicy[numberPositionPolicy] =
                result.selectedPolicy;
            }
            this.dataSourcePolicy.data = this.quotationPolicy;
            Alert.toastSWMessage(
              'success',
              'Registro actualizado satisfactoriamente.'
            );
          }
        } else {
          this.changeUrl = result.close;
          this.quotationPolicy.push(result.selectedPolicy);
          this.areaCostoFormGroup
            .get('quotationPolicy')
            ?.setValue(this.quotationPolicy);
          this.dataSourcePolicy.data = this.quotationPolicy;
          this.getQuotationPolicy();
        }
      }
    });
  }

  dataEditElement(index: number): void {
    const selectedElement = this.dataSourceElement.data[index];
    const numberPositionElement = index;
    this.openDialogElement('editar', selectedElement, numberPositionElement);
  }

  dataEditPolicy(index: number) {
    const selectedPolicy = this.dataSourcePolicy.data[index];
    const numberPositionPolicy = index;
    this.openDialogPoliza('editar', selectedPolicy, numberPositionPolicy);
  }

  deleteDataElement(index: number): void {
    Alert.questionConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        if (index >= 0 && index < this.elementsQuotations.length) {
          this.elementsQuotations.splice(index, 1);
          this.getQuotationElement();
        }
      }
    });
  }

  deleteDataPolicy(index: number): void {
    Alert.questionConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        if (index >= 0 && index < this.quotationPolicy.length) {
          this.quotationPolicy.splice(index, 1);
          this.getQuotationPolicy();
        }
      }
    });
  }

  disableFields() {
    const customersIdControl = this.areaCostoFormGroup.get('customersId');
    const prospectusNameControl = this.areaCostoFormGroup.get('prospectusName');
    const customersIdValue = customersIdControl?.value;
    const prospectusNameValue = prospectusNameControl?.value;

    if (customersIdValue) {
      prospectusNameControl?.disable({ emitEvent: false });
    } else {
      prospectusNameControl?.enable({ emitEvent: false });
    }

    if (prospectusNameValue) {
      customersIdControl?.disable({ emitEvent: false });
    } else {
      customersIdControl?.enable({ emitEvent: false });
    }
  }

  updateStarServiceDate(newDate: Date): void {
    if (newDate instanceof Date && !isNaN(newDate.getTime())) {
      this.areaCostoFormGroup.get('starServiceDate')?.setValue(newDate);
    }
  }

  goBack() {
    this.router.navigate(['/cotizaciones']);
    this.routeId = '';
    this.areaCostoFormGroup.get('contractDateStart')?.setValue('');
    this.areaCostoFormGroup.get('contractDateEnd')?.setValue('');
    this.savingQuotation = false;
    this.updateQuotation = false;
  }

  dataCreate() {
    this.openDialogElement('agregar');
  }

  dataCreatePoliza() {
    this.openDialogPoliza('agregar');
  }

  OnAction(): void {
    this.routeId = this.route.snapshot.params['id'];
    if (this.routeId && this.routeId !== '') {
      this.isInsertOrEditrRoute = true;
    } else {
      this.isInsertOrEditrRoute = false;
    }
  }

  formatUnitPrice(unitPrice: number): string {
    return this.decimalPipe.transform(unitPrice, '1.0-0') ?? '';
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.routeId = '';
    this.areaCostoFormGroup.get('contractDateStart')?.setValue('');
    this.areaCostoFormGroup.get('contractDateEnd')?.setValue('');
  }

  get id() {
    return this.areaCostoFormGroup.get('id');
  }
  get elementRequired() {
    return this.areaCostoFormGroup.get('elementRequired');
  }

  get prospectusName() {
    return this.areaCostoFormGroup.get('prospectusName');
  }
  get sundayPayment() {
    return this.areaCostoFormGroup.get('sundayPayment');
  }
  get bussinesLineId() {
    return this.areaCostoFormGroup.get('bussinesLineId');
  }
  get customersId() {
    return this.areaCostoFormGroup.get('customersId');
  }
  get contractDateStart() {
    return this.areaCostoFormGroup.get('contractDateStart');
  }
  get contractDateEnd() {
    return this.areaCostoFormGroup.get('contractDateEnd');
  }
  get starServiceDate() {
    return this.areaCostoFormGroup.get('starServiceDate');
  }
  get comission() {
    return this.areaCostoFormGroup.get('comission');
  }
  get indirectCosts() {
    return this.areaCostoFormGroup.get('indirectCosts');
  }
  get gyaCosts() {
    return this.areaCostoFormGroup.get('gyaCosts');
  }
  get industryCommerce() {
    return this.areaCostoFormGroup.get('industryCommerce');
  }
  get reinvestment() {
    return this.areaCostoFormGroup.get('reinvestment');
  }
  get aditionalHoursMargin() {
    return this.areaCostoFormGroup.get('aditionalHoursMargin');
  }
  get pay31Day() {
    return this.areaCostoFormGroup.get('pay31Day');
  }
  get law50() {
    return this.areaCostoFormGroup.get('law50');
  }
  get applicationRegistrationDate() {
    return this.areaCostoFormGroup.get('applicationRegistrationDate');
  }
  get fitLastRequestNumber() {
    return this.areaCostoFormGroup.get('fitLastRequestNumber');
  }
  get statusId() {
    return this.areaCostoFormGroup.get('statusId');
  }
}
