// import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
// import DataLabelsPlugin from 'chartjs-plugin-datalabels';
// import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

// import { EstadisticasService } from '../../service/estadisticas.service';
// import { BaseChartDirective } from 'ng2-charts';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Subscription } from 'rxjs';


// @Component({
//     selector: 'app-estadisticas',
//     templateUrl: './estadisticas.component.html',
//     styleUrls: ['./estadisticas.component.css']
// })

// export class PruebaComponent implements OnInit {

//     datesFormGroup: FormGroup;
//     month: string[] = [];
//     totalGenerated: number[] = [];
//     totalApproved: number[] = [];
//     totalOffersBussines: number[] = [];
//     businessLines: string[] = [];

//     constructor(private estadisticasService: EstadisticasService, private _formBuilder: FormBuilder) {

//         this.datesFormGroup = this._formBuilder.group({
//             startDate: ['', Validators.required],
//             endDate: [''],
//         });

//         this.totalOffersBussines = [];
//     }

//     ngOnInit(): void {
//         this.getDashboard();
//     }


//     getDashboard() {
//         let startDate = this.datesFormGroup.get('startDate')?.value ?? '';
//         let endDate = this.datesFormGroup.get('endDate')?.value ?? '';

//         startDate = this.formatDate(startDate);
//         endDate = this.formatDate(endDate);

//         this.estadisticasService.getDashBoard(startDate, endDate).subscribe({
//             next: res => {
//                 this.month = res.generatedVSApproveds.map((item: any) => item.month);
//                 this.totalGenerated = res.generatedVSApproveds.map((item: any) => item.totalGenerated);
//                 this.totalApproved = res.generatedVSApproveds.map((item: any) => item.totalApproved);

//                 this.businessLines = res.generatedByBusinessLines.map((item: any) => item.businessLine);
//                 this.totalOffersBussines = res.generatedByBusinessLines.map((item: any) => item.totalOffers);
                
//                 this.barChartDataHorizontalBussines.datasets[0].data = this.totalOffersBussines;
//                 this.barChartDataHorizontalBussines.labels = this.businessLines;

//                 this.barChartDataVertical.datasets[0].data = this.totalGenerated;
//                 this.barChartDataVertical.datasets[1].data = this.totalApproved;
//                 this.barChartDataVertical.labels = this.month;
//                 this.chart?.update();
//             }
//         });
//     }

//     // subscribeToDateChanges() {
//     //     this.dateChangeSubscription = this.datesFormGroup.valueChanges.subscribe(() => {
//     //         this.getDashboard();
//     //     });
//     // }

//     // ngOnDestroy(): void {
//     //     if (this.dateChangeSubscription) {
//     //         this.dateChangeSubscription.unsubscribe();
//     //     }
//     // }


//     formatDate(date: Date | null | undefined): string {
//         if (!date) {
//             return '';
//         }
//         return date.toISOString().slice(0, 10);
//     }


//     @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

//     public barChartOptionsVertical: ChartConfiguration['options'] = {
//         responsive: true,
//         indexAxis: 'x',
//         scales: {
//             y: {
//                 display: true,
//                 ticks: {
//                     color: 'black',
//                     font: {
//                         size: 12,
//                     },
//                 }
//             },
//             x: {}
//         },
//         plugins: {
//             legend: {
//                 display: true,
//             },
//             datalabels: {
//                 anchor: 'end',
//                 align: 'end',
//                 display: true,
//                 color: 'black',
//             },
//         },
//         layout: {
//             padding: {
//                 left: 10,
//                 right: 80,
//                 top: 10,
//                 bottom: 10,
//             },
//         },
//     };
//     public barChartTypeVertical: ChartType = 'bar';
//     public barChartPluginsVertical = [DataLabelsPlugin];


//     public barChartDataVertical: ChartData<'bar'> = {
//         labels: [],
//         datasets: [
//             {
//                 label: 'Ofertas generadas',
//                 data: this.totalGenerated,
//                 backgroundColor: '#FFA352',
//                 borderWidth: 0,
//                 barThickness: 40,
//             },
//             {
//                 label: 'Ofertas aprobadas',
//                 data: this.totalApproved,
//                 backgroundColor: '#AFA7A1',
//                 borderWidth: 0,
//                 barThickness: 40,
//             }
//         ],
//     };

//     get startDate() {
//         return this.datesFormGroup.get('startDate');
//     }
//     get endDate() {
//         return this.datesFormGroup.get('endDate');
//     }




//     ///////////////////

//     public barChartOptionsHorizontalBussines: ChartConfiguration['options'] = {
//         responsive: true,
//         indexAxis: 'y',
//         scales: {
//             x: {
//                 display: false,
//                 ticks: {
//                     color: 'black',
//                     font: {
//                         size: 12,
//                     },
//                 }
//             },
//             y: {}
//         },
//         plugins: {
//             legend: {
//                 display: true,
//             },
//             datalabels: {
//                 anchor: 'end',
//                 align: 'end',
//                 display: true,
//                 color: 'black',
//             },
//         },
//         layout: {
//             padding: {
//                 left: 10,
//                 right: 60,
//                 top: 10,
//                 bottom: 10,
//             },
//         },
//     };
//     public barChartTypeHorizontalBussines: ChartType = 'bar';
//     public barChartPluginsHorizontalBussines = [DataLabelsPlugin];


//     public barChartDataHorizontalBussines: ChartData<'bar'> = {
//         labels: [],
//         datasets: [
//             {
//                 data: this.totalOffersBussines,
//                 backgroundColor: ['#AFA7A1'],
//                 borderWidth: 0,
//                 barThickness: 40,
//                 label: 'Ofertas generadas línea negocio'
//             },
//         ],
//     };

// }