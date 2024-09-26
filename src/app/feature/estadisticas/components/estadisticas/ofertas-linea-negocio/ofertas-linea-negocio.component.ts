import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-ofertas-linea-negocio',
  templateUrl: './ofertas-linea-negocio.component.html',
  styleUrls: ['./ofertas-linea-negocio.component.css']
})
export class OfertasLineaNegocioComponent implements OnChanges {

  @Input() dataEstaditicas: any;
  totalOffersBussines: number[] = [];
  businessLines: string[] = [];

  constructor() {

  }

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.businessLines = changes['dataEstaditicas'].currentValue.map((item: any) => item.businessLine);
    this.totalOffersBussines = changes['dataEstaditicas'].currentValue.map((item: any) => item.totalOffers);

    this.barChartDataHorizontalBussines.datasets[0].data = this.totalOffersBussines;
    this.barChartDataHorizontalBussines.labels = this.businessLines;
    this.chartBussines?.update();

  }


  @ViewChild(BaseChartDirective) chartBussines: BaseChartDirective | undefined;

  public barChartOptionsHorizontalBussines: ChartConfiguration['options'] = {
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
        },
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
  public barChartTypeHorizontalBussines: ChartType = 'bar';
  public barChartPluginsHorizontalBussines = [DataLabelsPlugin];


  public barChartDataHorizontalBussines: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: this.totalOffersBussines,
        backgroundColor: ['#AFA7A1'],
        borderWidth: 0,
        barThickness: 21,
        label: 'Ofertas generadas línea negocio'
      },
    ],
  };

}
