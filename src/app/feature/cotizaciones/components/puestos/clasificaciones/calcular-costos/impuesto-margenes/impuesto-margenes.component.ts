import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ImpuestosMargenesDto } from 'src/app/feature/cotizaciones/models/costos-cotizacion';
import { MONEDA, PORCENTAJE } from 'src/app/helpers/constants';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-impuesto-margenes',
  templateUrl: './impuesto-margenes.component.html',
  styleUrls: ['./impuesto-margenes.component.css'],
})
export class ImpuestoMargenesComponent implements AfterViewInit {
  CONS_MONEDA: string = MONEDA;
  CONS_PORCENTAJE: string = PORCENTAJE;

  displayedColumns: string[] = ['taxName', 'cost', 'percentage'];
  @Input() dataSource: MatTableDataSource<ImpuestosMargenesDto> =
    new MatTableDataSource<ImpuestosMargenesDto>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private helperService: HelperService) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  formatNumber(value: number, format: string) {
    return this.helperService.validTextOrNumber(value, format);
  }
}
