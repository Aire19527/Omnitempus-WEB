import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseDto } from 'src/app/models/responseDto';
import { ReportesService } from '../../service/reportes.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { Cliente } from 'src/app/feature/clientes/models/clientes';
import {
  Cotizaciones,
  QuotationGetDto,
} from 'src/app/feature/cotizaciones/models/cotizaciones';
import { ClientesService } from 'src/app/feature/clientes/service/clientes.service';
import { CotizacionesService } from 'src/app/feature/cotizaciones/service/cotizaciones.service';
import { BusinessLines } from 'src/app/feature/catalogos/lineas-negocio/models/lineasNegocio';
import { LineasNegocioService } from 'src/app/feature/catalogos/lineas-negocio/service/lineas-negocio.service';
import { Utiles } from 'src/app/helpers/utiles_helpers';
import { Reporte } from 'src/app/helpers/enums';
import { ReporteModel } from '../../models/reportes';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-trazabilidad-cotizaciones',
  templateUrl: './form-trazabilidad-cotizaciones.component.html',
  styleUrls: ['./form-trazabilidad-cotizaciones.component.css'],
})
export class FormTrazabilidadCotizacionesComponent {
  traceabilityFormGroup: FormGroup;
  customerList: Cliente[] = [];
  quotationList: QuotationGetDto[] = [];
  businessLineList: BusinessLines[] = [];
  filteredCustomerList: Cliente[] = [];
  filteredQuotationList: QuotationGetDto[] = [];
  filteredBussinessList: BusinessLines[] = [];
  showNoCustomerMessageCustomer: boolean = false;
  showNoCustomerMessageQuotation: boolean = false;
  showNoCustomerMessageBussiness: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private reportesService: ReportesService,
    private spinner: NgxSpinnerService,
    private clientesService: ClientesService,
    private cotizacionesService: CotizacionesService,
    private lineasNegocioService: LineasNegocioService,
    private router: Router,
    public dialogRef: MatDialogRef<FormTrazabilidadCotizacionesComponent>
  ) {
    this.traceabilityFormGroup = this._formBuilder.group({
      id: 0,
      customerId: [null],
      quotationId: [null],
      businessLineId: [null],
    });
  }

  ngOnInit(): void {
    this.getCustomer();
    this.getQuotation();
    this.getBussinesLines();
  }

  goPreview() {
    const customersIdList: number[] =
      this.traceabilityFormGroup.value.customerId;
    const quotationsIdList: number[] =
      this.traceabilityFormGroup.value.quotationId;
    const businessIdList: number[] =
      this.traceabilityFormGroup.value.businessLineId;
    const parameters: any = {
      CustomersId: customersIdList,
      QuotationsId: quotationsIdList,
      BussinesLineId: businessIdList,
    };

    const reportParamter: ReporteModel = {
      idReport: Reporte.TrazabilidadCotizaciones,
      parameters: parameters,
      nameFile: 'Trazabilidad de cotizaciones',
    };
    this.reportesService.ReportParamter = reportParamter;
    this.router.navigateByUrl('reportes/report-viewer');
    this.dialogRef.close(true);
  }

  getCustomer() {
    this.clientesService.getCustomer().subscribe((res: Cliente[]) => {
      this.customerList = res;
      this.filteredCustomerList = [...res]; 
    });
  }

  getQuotation() {
    this.cotizacionesService.getQuotation().subscribe((res: QuotationGetDto[]) => {
        this.quotationList = res;
        this.filteredQuotationList = [...res]; 
      });
  }


  getBussinesLines() {
    this.lineasNegocioService.getBusinessLines().subscribe((res: BusinessLines[]) => {
        this.businessLineList = res.sort((a, b) => (a.name > b.name ? 1 : -1));
        this.filteredBussinessList = [...res]; 
      });
  }

  filterCustomers(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredCustomerList = this.customerList.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm)
    );
    this.showNoCustomerMessageCustomer = !this.filteredCustomerList.length;
  }

  filterQuotations(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredQuotationList = this.quotationList.filter(quotation =>
      quotation.requestNumber.toLowerCase().includes(searchTerm)
    );
    this.showNoCustomerMessageQuotation = !this.filteredQuotationList.length;
  }

  filterBussiness(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredBussinessList = this.businessLineList.filter(bussiness =>
      bussiness.name.toLowerCase().includes(searchTerm)
    );
    this.showNoCustomerMessageBussiness = !this.filteredBussinessList.length;
  }

  get getValidGenerate() {
    const customerId = this.traceabilityFormGroup.get('customerId')!.value;
    const quotationId = this.traceabilityFormGroup.get('quotationId')!.value;
    const businessLineId = this.traceabilityFormGroup.get('businessLineId')!.value;
    return quotationId !== null || customerId !== null || businessLineId !== null;;
  }

}