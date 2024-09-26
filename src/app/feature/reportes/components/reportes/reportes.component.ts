import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormSalariosCotizacionesComponent } from '../form-salarios-cotizaciones/form-salarios-cotizaciones.component';
import { FormElementosCotizacionesComponent } from '../form-elementos-cotizaciones/form-elementos-cotizaciones.component';
import { FormTrazabilidadCotizacionesComponent } from '../form-trazabilidad-cotizaciones/form-trazabilidad-cotizaciones.component';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  length: number = 0;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'acciones'];
  changeUrl: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const data = [
      { name: 'Salarios de cotizaciones activas' },
      { name: 'Elementos de cotizaciones activas' },
      { name: 'Trazabilidad de las cotizaciones' },
    ];
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.cdr.detectChanges();
  }

  generated() {}

  showSalaryQuotation(): void {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(FormSalariosCotizacionesComponent, {
      width: '60%',
      data: { title: 'crear' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeUrl = true;
      }
    });
  }

  showElementQuotation() {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(FormElementosCotizacionesComponent, {
      width: '60%',
      data: { title: 'crear' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeUrl = true;
      }
    });
  }

  showTraceabilityQuotation() {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(
      FormTrazabilidadCotizacionesComponent,
      {
        width: '60%',
        data: { title: 'crear' },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeUrl = true;
      }
    });
  }

  showProvider() {
    // this.changeUrl = false;
    // const dialogRef = this.matDialog.open(FormSalariosCotizacionesComponent, {
    //   width: '60%',
    //   data: { title: 'crear'},
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.changeUrl = true;
    //   }
    // });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
