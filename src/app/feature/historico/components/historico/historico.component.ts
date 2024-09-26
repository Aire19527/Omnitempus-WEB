import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Alert } from 'src/app/helpers/alert_helper';
import { HistoricoService } from '../../service/historico.service';
import { AuditDto, ConsultHistorical } from '../../models/historico';
import { ResponseDto } from 'src/app/models/responseDto';
import { audit } from 'rxjs';
import { FormHistoricoComponent } from '../form-historico/form-historico.component';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css'],
})
export class HistoricoComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<AuditDto> = new MatTableDataSource<AuditDto>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'registerDate',
    'action',
    'title',
    'user',
    'functionality',
    'acciones',
  ];
  historicoFormGroup: FormGroup;

  listUser: string[] = [];
  listFunctionality: string[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private historicoService: HistoricoService
  ) {
    this.historicoFormGroup = this._formBuilder.group({
      id: 0,
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      user: ['', Validators.required],
      functionality: [''],
    });
  }

  ngOnInit(): void {
    this.getAllUser();
    this.getAllFunctionality();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  searchHistory() {
    this.historicoFormGroup.markAllAsTouched();
    if (this.historicoFormGroup.invalid) {
      return;
    }

    const functionalities = this.historicoFormGroup.get('functionality')?.value;
    const consult: ConsultHistorical = {
      fromDate: this.historicoFormGroup.get('fromDate')?.value,
      toDate: this.historicoFormGroup.get('toDate')?.value,
      users: this.historicoFormGroup.get('user')?.value,
      functionalities: functionalities == '' ? [] : functionalities,
    };
    this.spinner.show();
    this.historicoService.getHistoricalAudit(consult).subscribe({
      next: (result: ResponseDto) => {
        const lista = result.result as AuditDto[];
        this.dataSource.data = lista;
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
      },
    });
  }

  getAllFunctionality() {
    this.spinner.show();
    this.historicoService.getAllFunctionality().subscribe({
      next: (result: ResponseDto) => {
        this.listFunctionality = result.result as string[];
      },
      error: (error) => {
        Alert.errorHttp(error);
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  getAllUser() {
    this.spinner.show();
    this.historicoService.getAllUser().subscribe({
      next: (result: ResponseDto) => {
        this.listUser = result.result as string[];
      },
      error: (error) => {
        Alert.errorHttp(error);
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  detail(audit: AuditDto) {
    this.dialogResult(audit);
  }

  dialogResult(audit: AuditDto) {
    const dialogRef = this.matDialog.open(FormHistoricoComponent, {
      width: '40%',
      data: audit,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
}
