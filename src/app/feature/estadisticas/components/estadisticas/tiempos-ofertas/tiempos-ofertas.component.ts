import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartDataset, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-tiempos-ofertas',
  templateUrl: './tiempos-ofertas.component.html',
  styleUrls: ['./tiempos-ofertas.component.css']
})
export class TiemposOfertasComponent implements OnChanges {

  @Input() dataEstaditicas: any;
  pieChartData: ChartDataset[] = [];
  pieChartLabels: string[] = []
  percentageLessThanSix: any;
  percentageUntilTen: any;
  percentageMoreThanTen: any;

  constructor() {
  }

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.percentageLessThanSix = changes['dataEstaditicas'].currentValue.percentageLessThanSix;
    this.percentageUntilTen = changes['dataEstaditicas'].currentValue.percentageUntilTen;
    this.percentageMoreThanTen = changes['dataEstaditicas'].currentValue.percentageMoreThanTen;
    this.updatePieChartData();
  }

  public pieChartType: ChartType = 'pie';

  updatePieChartData() {
    let backgroundColors: string[];
    let data: number[];

    if (this.percentageLessThanSix || this.percentageUntilTen || this.percentageMoreThanTen) {
      backgroundColors = ['#FFA352', '#AFA7A1', '#38B9EE'];
      data = [
        this.percentageLessThanSix,
        this.percentageUntilTen,
        this.percentageMoreThanTen
      ];
      this.pieChartLabels = ['< 6', '6 - 10', '> 10'];
    } else {
      backgroundColors = ['#CCCCCC'];
      data = [0.1];
    }

    this.pieChartData = [{ data: data, backgroundColor: backgroundColors, radius: 120 }];
  }

}
