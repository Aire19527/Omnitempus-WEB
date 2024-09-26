import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ReportesService } from '../../service/reportes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Elemento } from 'src/app/feature/elementos/models/elementos';
import { ElementosService } from 'src/app/feature/elementos/service/elementos.service';
import { ElementoType } from 'src/app/feature/catalogos/elementos/models/elemento';
import { ElementoService } from 'src/app/feature/catalogos/elementos/service/elemento.service';
import { Cliente } from 'src/app/feature/clientes/models/clientes';
import { QuotationGetDto } from 'src/app/feature/cotizaciones/models/cotizaciones';
import { CotizacionesService } from 'src/app/feature/cotizaciones/service/cotizaciones.service';
import { ClientesService } from 'src/app/feature/clientes/service/clientes.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Utiles } from 'src/app/helpers/utiles_helpers';
import { ReporteModel } from '../../models/reportes';
import { Reporte } from 'src/app/helpers/enums';
import { Router } from '@angular/router';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-form-elementos-cotizaciones',
  templateUrl: './form-elementos-cotizaciones.component.html',
  styleUrls: ['./form-elementos-cotizaciones.component.css'],
})
export class FormElementosCotizacionesComponent {
  elementoCotizacionFormGroup: FormGroup;
  customerList: any[] = [];
  quotationList: QuotationGetDto[] = [];
  elementTypeList: ElementoType[] = [];
  elementList: Elemento[] = [];
  filteredCustomerList: Cliente[] = [];
  filteredQuotationList: QuotationGetDto[] = [];
  filteredTypeElementList: ElementoType[] = [];
  filteredElementList: Elemento[] = [];
  showNoCustomerMessageCustomer: boolean = false;
  showNoCustomerMessageQuotation: boolean = false;
  showNoCustomerMessageElement: boolean = false;
  showNoCustomerMessageTypeElement: boolean = false;
  

  constructor(
    private _formBuilder: FormBuilder,
    private reportesService: ReportesService,
    private spinner: NgxSpinnerService,
    private elementosService: ElementosService,
    private elementoService: ElementoService,
    private clientesService: ClientesService,
    private cotizacionesService: CotizacionesService,
    private router: Router,
    public dialogRef: MatDialogRef<FormElementosCotizacionesComponent>
  ) {
    this.elementoCotizacionFormGroup = this._formBuilder.group({
      id: 0,
      customerId: [null],
      quotationId: [null],
      elementTypeId: [null],
      elementId: [{ value: null, disabled: true }],
    });
  }

  ngOnInit(): void {
    this.getElementType();
    this.getCustomer();
    this.getQuotation();

    this.elementoCotizacionFormGroup.get('elementTypeId')!.valueChanges
    .pipe(startWith(this.elementoCotizacionFormGroup.get('elementTypeId')!.value))
    .subscribe(value => {
      const elementControl = this.elementoCotizacionFormGroup.get('elementId');
      if (value) {
        elementControl?.enable();
      } else {
        elementControl?.disable();
      }
    });
  }

  goPreview() {
    const customersIdList: number[] =
      this.elementoCotizacionFormGroup.value.customerId;
    const quotationsIdList: number[] =
      this.elementoCotizacionFormGroup.value.quotationId;
    const elementsId: number[] =
      this.elementoCotizacionFormGroup.value.elementId;
    let parameters: any = {
      CustomersId: customersIdList,
      QuotationsId: quotationsIdList,
      ElementsId: elementsId,
    };

    const reportParamter: ReporteModel = {
      idReport: Reporte.ElementosCotizacionesActivas,
      parameters: parameters,
      nameFile: 'Elementos de cotizaciones activas',
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

  getElementType() {
    this.elementoService.getElementType().subscribe((res: ElementoType[]) => {
      this.elementTypeList = res.sort((a, b) => (a.name > b.name ? 1 : -1));
      this.filteredTypeElementList = [...res]; 
    });
  }

  getElement(event: any) {
    this.elementosService.getElementByElementType(event.value).subscribe((res: Elemento[]) => {
        this.elementList = res.sort((a, b) => (a.name > b.name ? 1 : -1));
        this.filteredElementList = [...res]; 
        this.showNoCustomerMessageTypeElement = true;
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

  filterElements(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredElementList = this.elementList.filter(element =>
      element.name.toLowerCase().includes(searchTerm)
    );
    this.showNoCustomerMessageElement = !this.filteredElementList.length;
  }

  filterTypeElements(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredTypeElementList = this.elementTypeList.filter(typeElement =>
      typeElement.name.toLowerCase().includes(searchTerm)
    );
    this.showNoCustomerMessageTypeElement = !this.filteredTypeElementList.length;
  }

  get getValidGenerate() {
    const quotationId = this.elementoCotizacionFormGroup.get('quotationId')!.value;
    const customerId = this.elementoCotizacionFormGroup.get('customerId')!.value;
    const elementTypeId = this.elementoCotizacionFormGroup.get('elementTypeId')!.value;
    const elementId = this.elementoCotizacionFormGroup.get('elementId')!.value;
    return quotationId !== null || customerId !== null || elementTypeId !== null || elementId !== null;
  }

}