import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TableService } from '../../services/table.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Alert } from 'src/app/helpers/alert_helper';
import { HelperService } from '../../services/helper.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { FormatField } from '../models/formatFieldDto';
import { MONEDA, PORCENTAJE } from 'src/app/helpers/constants';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, OnChanges {
  itemsPerPageLabel = 'Elementos por página';
  @Output() dataEdit = new EventEmitter();
  @Output() dataCreate = new EventEmitter();
  @Input() displayedColumns: string[] = [];
  @Input() titleColumn: string[] = [];
  @Input() url: string;
  @Input() urlDelete: string;
  @Input() changeUrl: boolean;
  @Input() title: string;
  @Input() showButtonCreate: boolean;
  @Input() validateFormat: boolean;
  @Input() format: FormatField;
  @Input() formatSecond: FormatField;
  @Input() maxLength: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  test: string;

  length: number = 0;
  dataSource: MatTableDataSource<any>;

  constructor(
    private tableService: TableService,
    private helperService: HelperService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['changeUrl'] &&
      !changes['changeUrl'].firstChange &&
      changes['changeUrl'].currentValue
    ) {
      this.getData();
    }
  }

  getData(): void {
    this.spinner.show();
    this.tableService.getData(this.url).subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response);
        this.length = response.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        console.error(error);
        Alert.errorHttp(error);
      },
    });
  }

  deleteData(data: any): void {
    let urlDelete = '';
    if (this.urlDelete) {
      urlDelete = this.urlDelete;
    } else {
      urlDelete = this.url;
    }
    Alert.questionConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.tableService.deleteData(urlDelete, data.id).subscribe({
          next: () => {
            Alert.toastSWMessage('success', 'Registro eliminado.');
            this.getData();
            this.spinner.hide();
          },
          error: (error: any) => {
            this.spinner.hide();
            console.error(error);
            Alert.errorHttp(error);
          },
        });
      }
    });
  }

  editData(data: any): void {
    this.dataEdit.emit(data);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  validTextOrNumber(value: any, title: string) {
    if (title.toLowerCase() === 'nit') {   
      return this.helperService.formatNumberWithoutHyphen(value);
    }

    const isNumber: boolean = !isNaN(parseFloat(value));
    if (isNumber) {
      return this.getValueNumber(
        this.helperService.formatearNumero(value),
        title
      );
    } else {
      return this.cropText(value);
    }
  }

  getValueNumber(value: string, title: string) {
    if (this.format && this.validateFormat && title === this.format.field) {
      switch (this.format.format.toLowerCase()) {
        case MONEDA: {
          return '$' + value;
        }
        case PORCENTAJE: {
          return value + '%';
        }
        default: {
          return value;
        }
      }
    } else if (
      this.formatSecond &&
      this.validateFormat &&
      title === this.formatSecond.field
    ) {
      switch (this.formatSecond.format.toLowerCase()) {
        case MONEDA: {
          return '$' + value;
        }
        case PORCENTAJE: {
          return value + '%';
        }
        default: {
          return value;
        }
      }
    } else {
      return value;
    }
  }

  cropText(text: string): string {
    let maxLength: number = 50;
    if (this.maxLength) {
      maxLength = this.maxLength;
    }

    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    }
    return text;
  }

  createData() {
    this.dataCreate.emit();
  }
}
