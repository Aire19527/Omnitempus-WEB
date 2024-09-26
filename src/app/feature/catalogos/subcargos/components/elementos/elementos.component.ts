import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormElementosComponent } from '../form-elementos/form-elementos.component';
import { ElementByProvider } from '../../models/subcargos';
import { SubcargosService } from '../../service/subcargos.service';
import { MatSort } from '@angular/material/sort';
import { Alert } from 'src/app/helpers/alert_helper';
import { Elemento } from 'src/app/feature/elementos/models/elementos';
import { ResponseDto } from 'src/app/models/responseDto';
import { DecimalPipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-elementos-sub-cargos',
  templateUrl: './elementos.component.html',
  styleUrls: ['./elementos.component.css'],
})
export class ElementosSubCargosComponent implements OnInit {
  @Input() subChargesId: number;
  displayedColumns = ['elementTypeName', 'elementName', 'quantity', 'acciones'];
  elementSubchargerList: number;
  changeUrl: boolean = false;
  stepClose: boolean = false;
  elementProviderList: ElementByProvider[] = [];
  element: Elemento[] = [];
  selectedRowIndex: number = -1;
  namePosition: string;
  nameSubcharger: string;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator | null;
  @ViewChild(MatSort) sort: MatSort | null;

  constructor(
    private matDailog: MatDialog,
    private router: Router,
    private subcargosService: SubcargosService,
    private decimalPipe: DecimalPipe,
  ) { }

  ngOnInit(): void {
    this.getSubchargesElementByIdSubcharges();

    this.subcargosService.getSubcharger().subscribe(nameSubcharger => {
      this.nameSubcharger = nameSubcharger;
    });
    this.subcargosService.getPosition().subscribe(namePosition => {
      this.namePosition = namePosition;
    });
  }

  getSubchargesElementByIdSubcharges(): void {
    this.subcargosService
      .getSubchargesElementsByIdSubcharges(this.subChargesId)
      .subscribe({
        next: (res: any[]) => {
          this.elementProviderList = res;
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
      });
  }

  openDialog(action: string, data?: any): void {
    this.changeUrl = false;
    if (!data) {
      data = {
        subChargesId: this.subChargesId,
      };
    }
    const dialogRef = this.matDailog.open(FormElementosComponent, {
      width: '60%',
      data: { title: action, data: data, dataSelection: this.selectedRowIndex },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeUrl = result;
        this.getSubchargesElementByIdSubcharges();
      }
    });
  }

  deleteData(data: any): void {
    Alert.questionConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.subcargosService.deleteSubchargeElements(data.id).subscribe({
          next: (response: ResponseDto) => {
            this.getSubchargesElementByIdSubcharges();
            Alert.toastSWMessage('success', response.message);
          },
          error: (err: any) => {
            console.error(err);
            Alert.error('Ha ocurrido un error, por favor vuelva a intentarlo');
          },
        });
      }
    });
  }

  dataEdit(data: ElementByProvider) {
    this.openDialog('editar', data);
  }

  formatUnitPrice(unitPrice: number): string {
    return this.decimalPipe.transform(unitPrice, '1.0-0') ?? '';
  }

  goBack() {
    this.router.navigate(['catalogo/subcargos']);
  }
}
