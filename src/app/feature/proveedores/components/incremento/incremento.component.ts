import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ProveedoresService } from '../../service/proveedores.service';
import { ElementProvider } from '../../models/proveedores';
import { Elemento } from 'src/app/feature/elementos/models/elementos';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';
import { ResponseDto } from 'src/app/models/responseDto';

@Component({
  selector: 'app-incremento',
  templateUrl: './incremento.component.html',
  styleUrls: ['./incremento.component.css'],
})
export class IncrementoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  incrementList: number;
  displayedColumns = [
    'updateDate',
    'percentage',
    'lastUnitPrice',
    'currentPrice',
  ];
  changeUrl: boolean = false;
  titleButton: string;
  action: string | undefined;
  elementProvidersList: ElementProvider[] = [];
  dataSource!: MatTableDataSource<any>;
  elementName: string;

  constructor(
    public dialogRef: MatDialogRef<IncrementoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private proveedoresService: ProveedoresService,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.onAction();
    this.elementName = this.data?.element
    const id = this.data?.id;
    if (id) {
      this.getIncrementDataById(id);
    }
    this.getElementProvider();
  }

  getIncrementDataById(id: number): void {
    this.proveedoresService.getelementProviderHistoricIncrementsByid(id).subscribe((res: ResponseDto) => {
      if (res.isSuccess && res.result) {
          this.dataSource = new MatTableDataSource<ResponseDto>(res.result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      } else {
        console.error('No se pudo obtener los datos de incremento');
      }
    });
  }

  getElementProvider(): void {
    this.proveedoresService.getElementProvider().subscribe((res: ElementProvider[]) => {
      this.elementProvidersList = res;
    });
  }

  onAction(): void {
    if (this.action === 'crear') {
      this.titleButton = 'Guardar';
    } else if (this.action === 'editar') {
      this.titleButton = 'Editar';
    }
  }

  formatUnitPrice(unitPrice: number): string {
    return this.decimalPipe.transform(unitPrice, '1.0-0') ?? '';
  }

  closeModal() {
    this.dialogRef.close();
  }
}
