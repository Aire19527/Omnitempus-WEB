import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { CotizacionesService } from '../../../service/cotizaciones.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ResponseDto } from 'src/app/models/responseDto';

@Component({
  selector: 'app-historico-estado',
  templateUrl: './historico-estado.component.html',
  styleUrls: ['./historico-estado.component.css']
})
export class HistoricoEstadoComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource!: MatTableDataSource<any>;
  incrementList: number;
  displayedColumns = ['date','beforeQuotationStatus','newQuotationStatus', 'observations', 'user'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<HistoricoEstadoComponent>,
    private cotizacionesService: CotizacionesService
  ){

  }

  ngOnInit(): void{

    const quotationId = parseInt(this.data?.quoationId);
    if (quotationId) {
      this.getStatusHistoric(quotationId);
    }
    this.dataSource = new MatTableDataSource<any>();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getStatusHistoric(quotationId: number){
    this.cotizacionesService.getStatusHistoric(quotationId).subscribe((res: ResponseDto[]) => {
      if(res){
        this.dataSource = new MatTableDataSource<ResponseDto>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  closeModal() {
    this.dialogRef.close();
  }

  
}
