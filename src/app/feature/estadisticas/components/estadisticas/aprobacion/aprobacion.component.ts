import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxGaugeType } from '../enum';

@Component({
  selector: 'app-aprobacion',
  templateUrl: './aprobacion.component.html',
  styleUrls: ['./aprobacion.component.css']
})
export class AprobacionComponent implements OnChanges {

  @Input() dataEstaditicas: any;
  gaugeType: NgxGaugeType = NgxGaugeType.FULL;
  percentageApproved: number = 0;

  constructor() {

  }

  ngOnInit(): void {
      this.percentageApproved = 0
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.percentageApproved = changes['dataEstaditicas'].currentValue;
  }

  thresholdConfig = {
    '0': { color: '#EF453A' },
    '40': { color: '#FFA352' },
    '75': { color: '#38EE75' }
  };

}
