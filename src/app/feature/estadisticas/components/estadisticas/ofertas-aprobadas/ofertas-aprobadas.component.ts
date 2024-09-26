import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-ofertas-aprobadas',
  templateUrl: './ofertas-aprobadas.component.html',
  styleUrls: ['./ofertas-aprobadas.component.css']
})
export class OfertasAprobadasComponent implements OnChanges{

  @Input() dataEstaditicas: any;
  totalGenerated: number[] = [];
  totalApproved: number[] = [];
  month: string[] = [];

  constructor() {

  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.totalGenerated = changes['dataEstaditicas'].currentValue.map((item: any) => item.totalGenerated);
    this.totalApproved = changes['dataEstaditicas'].currentValue.map((item: any) => item.totalApproved);
    this.month = changes['dataEstaditicas'].currentValue.map((item: any) => item.month);

    this.barChartDataVertical.datasets[0].data = this.totalGenerated;
    this.barChartDataVertical.datasets[1].data = this.totalApproved;
    this.barChartDataVertical.labels = this.month;
    this.chart?.update();
  }


  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  public barChartOptionsVertical: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'x',
    scales: {
      y: {
        display: true,
        ticks: {
          color: 'black',
          font: {
            size: 12,
          },
        }
      },
      x: {}
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
        right: 50,
        top: 10,
        bottom: 10,
      },
    },
  };
  public barChartTypeVertical: ChartType = 'bar';
  public barChartPluginsVertical = [DataLabelsPlugin];


  public barChartDataVertical: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Ofertas generadas',
        data: this.totalGenerated,
        backgroundColor: '#FFA352',
        borderWidth: 0,
        barThickness: 40,
      },
      {
        label: 'Ofertas aprobadas',
        data: this.totalApproved,
        backgroundColor: '#AFA7A1',
        borderWidth: 0,
        barThickness: 40,
      }
    ],
  };

}
