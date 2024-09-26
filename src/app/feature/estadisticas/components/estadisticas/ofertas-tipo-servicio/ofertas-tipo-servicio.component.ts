import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js/dist';

@Component({
  selector: 'app-ofertas-tipo-servicio',
  templateUrl: './ofertas-tipo-servicio.component.html',
  styleUrls: ['./ofertas-tipo-servicio.component.css']
})
export class OfertasTipoServicioComponent implements OnChanges {

  @Input() dataEstaditicas: any;
  totalOffersService: number[] = [];
  serviceType: string[] = [];
  
  constructor() {

  }

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.serviceType = changes['dataEstaditicas'].currentValue.map((item: any) => item.serviceType);
    this.totalOffersService = changes['dataEstaditicas'].currentValue.map((item: any) => item.totalOffers);
  
    this.barChartDataHorizontalService.datasets[0].data = this.totalOffersService;
    this.barChartDataHorizontalService.labels = this.serviceType;
    this.chartService?.update();
  }

  @ViewChild(BaseChartDirective) chartService: BaseChartDirective | undefined;

  public barChartOptionsHorizontalService: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y',
    scales: {
      x: {
        display: true,
        ticks: {
          color: 'black',
          font: {
            size: 12,
          },
        }
      },
      y: {
        ticks: {
          color: 'black', // color de los números del eje y
          font: {
            size: 12, // tamaño de los números del eje y
          },
        }
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        display: true,
        color: 'black',
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 60,
        top: 10,
        bottom: 10,
      },
    },
  };
  public barChartTypeHorizontalService: ChartType = 'bar';
  public barChartPluginsHorizontalService = [DataLabelsPlugin];


  public barChartDataHorizontalService: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: this.totalOffersService,
        backgroundColor: ['#FFA352'],
        borderWidth: 0,
        barThickness: 30,
        label: 'Ofertas generadas tipo servicio'
      },
    ],
  };


}
