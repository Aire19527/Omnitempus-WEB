import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CrearEditarComponent } from './crear-editar/crear-editar.component';
import { ConceptoBaseSalarialService } from 'src/app/feature/catalogos/concepto-base-salarial/service/concepto-base-salarial.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConceptoBaseSalarialModel } from 'src/app/feature/catalogos/concepto-base-salarial/models/concepto-base-salarial-model';
import { lastValueFrom } from 'rxjs';
import { Alert } from 'src/app/helpers/alert_helper';
import { SalaryBaseConceptsQuotationDto } from 'src/app/feature/catalogos/subcargos/models/elementsProvider';
import { SalaryBaseConceptsEstimateService } from 'src/app/feature/cotizaciones/service/salary-base-concepts-estimate.service';
import { ResponseDto } from 'src/app/models/responseDto';
import { PrincipalInfoSubChargesQuotationDto } from 'src/app/feature/cotizaciones/models/principalInfoSubChargesQuotationDto';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CotizacionesService } from 'src/app/feature/cotizaciones/service/cotizaciones.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RefrescarComponentesService } from 'src/app/feature/cotizaciones/service/refrescar-componentes.service';

@Component({
  selector: 'app-salario',
  templateUrl: './salario.component.html',
  styleUrls: ['./salario.component.css'],
})
export class SalarioComponent implements OnInit, AfterViewInit {
  concepts: ConceptoBaseSalarialModel[] = [];
  @Input()
  principalInfoSubChargesQuotation: PrincipalInfoSubChargesQuotationDto;

  displayedColumns: string[] = ['concept', 'value', 'acciones'];
  dataSource: MatTableDataSource<SalaryBaseConceptsQuotationDto> =
    new MatTableDataSource<SalaryBaseConceptsQuotationDto>();
  isStatusDisabled: boolean = false;
  statusName: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private matDialog: MatDialog,
    private spinner: NgxSpinnerService,
    private conceptoBaseSalarialService: ConceptoBaseSalarialService,
    private salaryBaseConceptsEstimateService: SalaryBaseConceptsEstimateService,
    private cotizacionesService: CotizacionesService,
    private refrescarComponentesService: RefrescarComponentesService
  ) {
    this.refrescarComponentesService.refreschElement$.subscribe(() => {
      this.getAll();
    });
  }

  ngOnInit(): void {
    if (this.principalInfoSubChargesQuotation.subChargesQuotation?.salarys) {
      this.dataSource.data =
        this.principalInfoSubChargesQuotation.subChargesQuotation?.salarys;
    }
    this.statusName = this.cotizacionesService.getStatusName();
    this.updateStatusDisabled();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  updateStatusDisabled() {
    if (
      this.statusName === 'Enviada al Solicitante' ||
      this.statusName === 'Enviada al Cliente' ||
      this.statusName === 'Aprobada' ||
      this.statusName === 'Reemplazada' ||
      this.statusName === 'No Aprobada' ||
      this.statusName === 'Anulada'
    ) {
      this.isStatusDisabled = true;
    } else {
      this.isStatusDisabled = false;
    }
  }

  async openDialog(data?: SalaryBaseConceptsQuotationDto) {
    if (this.concepts.length > 0) {
      this.dialogResult(data);
    } else {
      try {
        this.spinner.show();
        this.concepts = await lastValueFrom(
          this.conceptoBaseSalarialService.getAll()
        );
        this.spinner.hide();
      } catch (error) {
        console.error(error);
        Alert.error(
          'Ha ocurrido un error interno, por favor volverlo a intentar.'
        );
      }

      if (this.concepts.length > 0) {
        this.dialogResult(data);
      } else {
        Alert.warning(
          'Por favor registrar primero las condiciones salariales, para continuar con los salarios.'
        );
      }
    }
  }

  dialogResult(data?: SalaryBaseConceptsQuotationDto): void {
    this.matDialog
      .open(CrearEditarComponent, {
        width: '60%',
        data: {
          concepts: this.concepts,
          salary: data,
          subChargesQuotationId: this.principalInfoSubChargesQuotation.id,
        },
      })
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (value) {
            this.getAll();
          }
        },
      });
  }

  dataEdit(data: SalaryBaseConceptsQuotationDto) {
    this.openDialog(data);
  }

  deleteData(data: SalaryBaseConceptsQuotationDto) {
    Alert.questionConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.salaryBaseConceptsEstimateService.delete(data.id).subscribe({
          next: (response: ResponseDto) => {
            if (response.isSuccess) {
              Alert.toastSWMessage('success', response.message);
              this.getAll();
            } else {
              Alert.toastSWMessage('warning', response.message);
            }
            this.spinner.hide();
          },
          error: (error) => {
            this.spinner.hide();
            Alert.errorHttp(error);
          },
        });
      }
    });
  }

  getAll() {
    this.spinner.show();
    this.salaryBaseConceptsEstimateService
      .getAllSalaryEstimate(this.principalInfoSubChargesQuotation.id)
      .subscribe({
        next: (response: SalaryBaseConceptsQuotationDto[]) => {
          this.dataSource.data = response;
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }
}
