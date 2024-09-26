import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportesService } from '../../service/reportes.service';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddCliente, Cliente } from 'src/app/feature/clientes/models/clientes';
import { ClientesService } from 'src/app/feature/clientes/service/clientes.service';
import { CotizacionesService } from 'src/app/feature/cotizaciones/service/cotizaciones.service';
import { Cotizaciones, QuotationGetDto } from 'src/app/feature/cotizaciones/models/cotizaciones';
import { Utiles } from 'src/app/helpers/utiles_helpers';
import { ReporteModel } from '../../models/reportes';
import { Reporte } from 'src/app/helpers/enums';
import { Observable, map, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-salarios-cotizaciones',
  templateUrl: './form-salarios-cotizaciones.component.html',
  styleUrls: ['./form-salarios-cotizaciones.component.css'],
})
export class FormSalariosCotizacionesComponent {
  salarioCotizacionFormGroup: FormGroup;
  customerList: Cliente[] = [];
  quotationList: QuotationGetDto[] = [];
  filteredCustomerList: Cliente[] = [];
  filteredQuotationList: QuotationGetDto[] = [];
  showNoCustomerMessageCustomer: boolean = false;
  showNoCustomerMessageQuotation: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private reportesService: ReportesService,
    private spinner: NgxSpinnerService,
    private clientesService: ClientesService,
    private cotizacionesService: CotizacionesService,
    private router: Router,
    public dialogRef: MatDialogRef<FormSalariosCotizacionesComponent>
  ) {
    this.salarioCotizacionFormGroup = this._formBuilder.group({
      id: 0,
      customerId: [null],
      quotationId: [null],
    });
  }

  ngOnInit(): void {
    this.getcustomer();
    this.getQuotation();
  }

  goPreview() {
    const quotationsIdList: number[] =
      this.salarioCotizacionFormGroup.value.quotationId;
    const customersIdList: number[] =
      this.salarioCotizacionFormGroup.value.customerId;
    let parameters: any = {
      QuotationsId: quotationsIdList,
      CustomersId: customersIdList,
    };
    const reportParamter: ReporteModel = {
      idReport: Reporte.SalariosCotizacionesActivas,
      parameters: parameters,
      nameFile: 'Salario de cotizaciones activas',
    };
    this.reportesService.ReportParamter = reportParamter;
    this.router.navigateByUrl('reportes/report-viewer');
    this.dialogRef.close(true);
  }

  getcustomer() {
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


  get getValidGenerate() {
    const quotationId = this.salarioCotizacionFormGroup.get('quotationId')!.value;
    const customerId = this.salarioCotizacionFormGroup.get('customerId')!.value;
    return quotationId !== null  || customerId !== null;
  }
}
