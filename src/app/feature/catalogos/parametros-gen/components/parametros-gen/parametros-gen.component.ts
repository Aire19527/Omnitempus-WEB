import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CrearParametrosGenComponent } from '../crear-parametros-gen/crear-parametros-gen.component';
import { ParameterGen } from '../../models/parametro-gen';
import { ParametroGenService } from '../../service/parametro-gen.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HelperService } from 'src/app/shared/services/helper.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MONEDA, NUMERO, PORCENTAJE } from 'src/app/helpers/constants';

@Component({
  selector: 'app-parametros-gen',
  templateUrl: './parametros-gen.component.html',
  styleUrls: ['./parametros-gen.component.css'],
})
export class ParametrosGenComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'parameter',
    'value',
    'minimumValue',
    'maximumValue',
    'parameterType',
    'acciones',
  ];
  dataSource: MatTableDataSource<ParameterGen> =
    new MatTableDataSource<ParameterGen>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private matDialog: MatDialog,
    public helperService: HelperService,
    private parameterService: ParametroGenService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getAllParameters();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllParameters() {
    this.spinner.show();
    this.parameterService.getParameter().subscribe({
      next: (res) => {
        this.spinner.hide();
        this.dataSource.data = res as ParameterGen[];
      },
      error: (error) => {
        this.spinner.hide();
        console.error(error);
        Alert.errorHttp(error);
      },
    });
  }

  OpenDialog(data?: ParameterGen): void {
    this.matDialog
      .open(CrearParametrosGenComponent, {
        width: '60%',
        data: data,
      })
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (value) {
            this.getAllParameters();
          }
        },
      });
  }

  dataEdit(data: ParameterGen) {
    this.OpenDialog(data);
  }

  getValue(parameter: ParameterGen) {
    if (!parameter.isRange) {
      switch (parameter.valueType.toLowerCase()) {
        case MONEDA: {
          return (
            '$' + this.helperService.formatearNumero(Number(parameter.value))
          );
        }
        case PORCENTAJE: {
          return (
            this.helperService.formatearNumero(Number(parameter.value)) + '%'
          );
        }
        default: {
          return this.helperService.formatearNumero(Number(parameter.value));
        }
      }
    } else {
      return '';
    }
  }

  getMinimoValue(parameter: ParameterGen) {
    if (parameter.isRange) {
      switch (parameter.valueType.toLowerCase()) {
        case MONEDA: {
          return (
            '$' +
            this.helperService.formatearNumero(Number(parameter.minimumValue))
          );
        }
        case PORCENTAJE: {
          return (
            this.helperService.formatearNumero(Number(parameter.minimumValue)) +
            '%'
          );
        }
        default: {
          return this.helperService.formatearNumero(
            Number(parameter.minimumValue)
          );
        }
      }
    }
    return '';
  }

  getMaximoValue(parameter: ParameterGen) {
    if (parameter.isRange) {
      switch (parameter.valueType.toLowerCase()) {
        case MONEDA: {
          return (
            '$' +
            this.helperService.formatearNumero(Number(parameter.maximumValue))
          );
        }
        case PORCENTAJE: {
          return (
            this.helperService.formatearNumero(Number(parameter.maximumValue)) +
            '%'
          );
        }
        default: {
          return this.helperService.formatearNumero(
            Number(parameter.maximumValue)
          );
        }
      }
    } else {
      return '';
    }
  }
}
