import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChartDataset } from 'chart.js';

import { EstadisticasService } from '../../service/estadisticas.service';
import { NgxGaugeType } from './enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})

export class EstadisticasComponent implements OnInit {

  datesFormGroup: FormGroup;
  dashboardListQuotation: any[] = [];
  dashboardListApproved: any[] = [];
  dashboardListGenerated: any[] = [];
  dashboardListBusinessLines: any[] = []
  dashboardListServiceType: any[] = []
  offersGenerated: number = 0;
  totalValued: number = 0;
  currentYear: number;

  constructor(private estadisticasService: EstadisticasService, private _formBuilder: FormBuilder, private decimalPipe: DecimalPipe) {

    this.datesFormGroup = this._formBuilder.group({
      startDate: ['', Validators.required],
      endDate: [''],
    });
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.getDashboard();
  }

  getDashboard() {
    let startDate = this.datesFormGroup.get('startDate')?.value ?? '';
    let endDate = this.datesFormGroup.get('endDate')?.value ?? '';

    startDate = this.formatDate(startDate);
    endDate = this.formatDate(endDate);
    this.estadisticasService.getDashBoard(startDate, endDate).subscribe({

      next: res => {
        this.offersGenerated = res.offersGenerated;
        this.totalValued = res.totalValued;
        this.dashboardListQuotation = res.timeQuotation;
        this.dashboardListApproved = res.percentageApproved;
        this.dashboardListGenerated = res.generatedVSApproveds;
        this.dashboardListBusinessLines = res.generatedByBusinessLines;
        this.dashboardListServiceType = res.generatedByServiceTypes;
      }
    });
  }

  formatDate(date: Date | null | undefined): string {
    if (!date) {
      return '';
    }
    return date.toISOString().slice(0, 10);
  }

  formatPrices(price: number): string {
    return this.decimalPipe.transform(price, '1.0-0') ?? '';
  }

  get startDate() {
    return this.datesFormGroup.get('startDate');
  }
  get endDate() {
    return this.datesFormGroup.get('endDate');
  }
}