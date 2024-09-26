import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { AgregarNotaComponent } from './agregar-nota/agregar-nota.component';
import { CotizacionesService } from '../../service/cotizaciones.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseDto } from 'src/app/models/responseDto';
import { NgxSpinnerService } from 'ngx-spinner';
import { StateChangeService } from '../../service/state-change.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { TextoCotizacionService } from 'src/app/feature/catalogos/texto-cotizacion/service/texto-cotizacion.service';
import { TextoCotizacionModel } from 'src/app/feature/catalogos/texto-cotizacion/models/textp-cotizacion';
import { lastValueFrom } from 'rxjs';
import { QuotationNoteService } from '../../service/quotation-note.service';
import {
  QuotationEconomicProposalDto,
  QuotationNoteDto,
} from '../../models/cotizaciones';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Utiles } from 'src/app/helpers/utiles_helpers';
import { ReportesService } from 'src/app/feature/reportes/service/reportes.service';
import { Reporte } from 'src/app/helpers/enums';
import {
  ConsultReport,
  ReporteModel,
} from 'src/app/feature/reportes/models/reportes';

@Component({
  selector: 'app-propuesta-economica',
  templateUrl: './propuesta-economica.component.html',
  styleUrls: ['./propuesta-economica.component.css'],
})
export class PropuestaEconomicaComponent implements OnInit, AfterViewInit {
  notasCotizaciones: TextoCotizacionModel[] = [];
  quotationId: number;
  displayedColumns: string[] = ['name', 'noteText', 'acciones'];
  dataSource: MatTableDataSource<QuotationNoteDto> =
    new MatTableDataSource<QuotationNoteDto>();

  stateChangeForm: FormGroup;
  parametrosAdicionalesForm: FormGroup;
  statusName: string;

  lastStatusId: number;
  isStatusDisabled: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private spinner: NgxSpinnerService,
    private cotizacionesService: CotizacionesService,
    private stateChangeService: StateChangeService,
    private route: ActivatedRoute,
    private textoCotizacionService: TextoCotizacionService,
    private quotationNoteService: QuotationNoteService,
    private router: Router,
    private reportesService: ReportesService
  ) {
    this.stateChangeForm = this._formBuilder.group({
      quotationId: [null],
      newStatusId: [null],
      lastStatusId: [null],
      observations: [''],
    });
    this.quotationId = this.route.snapshot.params['id'];
    this.cotizacionesService.quotationId$.subscribe((id) => {
      if (id) {
        this.quotationId = id;
        this.stateChangeForm.get('id')?.setValue(this.quotationId);
      }
    });

    this.parametrosAdicionalesForm = this._formBuilder.group({
      contactOT: [null],
      position: [null],
      implementationManager: [null],
      approvalObservation: [null],
      notes: [null],
      attention: [null],
      email: [null, [Validators.email]],
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.statusName = this.cotizacionesService.getStatusName();
    this.cotizacionesService.statusName$.subscribe((statusName) => {
      this.statusName = statusName;
    });
    this.updateStatusDisabled();
    if (this.quotationId) {
      this.getAll();
      this.getQuotationEconomicProposal();
    }
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
      this.parametrosAdicionalesForm.disable();
    } else {
      this.isStatusDisabled = false;
      this.parametrosAdicionalesForm.enable();
    }
  }

  goPreview() {
    const reportParamter: ReporteModel = {
      idReport: Reporte.OfertaEconomica,
      parameters: {
        QuotationId: this.quotationId,
      },
      nameFile: 'Oferta económica',
    };
    this.reportesService.ReportParamter = reportParamter;

    //this.router.navigateByUrl('reportes/report-viewer');
    sessionStorage.setItem('reportEconomical', JSON.stringify(reportParamter));

    const reportUrl = this.router.serializeUrl(
      this.router.createUrlTree(['reportes/report-viewer'])
    );

    window.open(reportUrl, '_blank');
  }

  saveStateChange() {
    if (this.statusName === 'Solicitada') {
      this.lastStatusId = 2;
    } else if (this.statusName === 'Revisión Costos') {
      this.lastStatusId = 3;
    }
    if (this.quotationId) {
      this.stateChangeForm.patchValue({
        quotationId: this.quotationId,
        lastStatusId: this.lastStatusId,
        newStatusId: 4,
      });
      this.stateChangeService
        .saveStateChange(this.stateChangeForm.value)
        .subscribe({
          next: (response: ResponseDto) => {
            if (response.isSuccess) {
              this.statusName = 'Generada';
              this.cotizacionesService.changeStatus(4);
              this.cotizacionesService.setStatusName(this.statusName);
              this.cotizacionesService.setStatusId(4);
              Alert.warning('El código de oferta es ' + response.result).then(
                () => {
                  // this.cotizacionesService.setNamRequest(response.result);
                  this.cotizacionesService.setNamOffert(response.result);
                  Alert.toastSWMessage('success', response.message);
                }
              );
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
  }

  get test() {
    return (
      this.statusName === 'Solicitada' ||
      this.statusName === 'Revisión Costos' ||
      this.statusName === 'Generada' ||
      this.statusName === 'Enviada al Solicitante' ||
      this.statusName === 'Enviada al Cliente' ||
      this.statusName === 'Aprobada' ||
      this.statusName === 'Reemplazada' ||
      this.statusName === 'No Aprobada'
    );
  }

  goBack() {
    this.router.navigate(['/cotizaciones']);
  }

  async openDialog() {
    if (this.notasCotizaciones.length > 0) {
      this.openDialogAddNote();
    } else {
      try {
        this.spinner.show();
        this.notasCotizaciones = await lastValueFrom(
          this.textoCotizacionService.getAll()
        );
        this.spinner.hide();
      } catch (error) {
        console.error(error);
        Alert.error(
          'Ha ocurrido un error interno, por favor volverlo a intentar.'
        );
      }

      if (this.notasCotizaciones.length > 0) {
        this.openDialogAddNote();
      } else {
        Alert.warning('Por favor registrar primero las notas de cotización.');
      }
    }
  }

  reloadID() {
    if (!this.quotationId) {
      this.quotationId = this.cotizacionesService.getQuotationId();
    }
  }

  openDialogAddNote(): void {
    this.reloadID();
    const dialogRef = this.matDialog.open(AgregarNotaComponent, {
      width: '60%',
      data: {
        notasCotizaciones: this.notasCotizaciones,
        quotationId: this.quotationId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAll();
      }
    });
  }

  getAll() {
    this.spinner.show();
    this.quotationNoteService
      .getQuoteNotesByQuotationId(this.quotationId)
      .subscribe({
        next: (response: ResponseDto) => {
          this.dataSource.data = response.result as QuotationNoteDto[];
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }

  getQuotationEconomicProposal() {
    this.spinner.show();
    this.cotizacionesService
      .getQuotationEconomicProposal(this.quotationId)
      .subscribe({
        next: (response: ResponseDto) => {
          const parameter = response.result as QuotationEconomicProposalDto;
          this.parametrosAdicionalesForm.patchValue(parameter);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }

  deleteData(data: QuotationNoteDto) {
    Alert.questionConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.quotationNoteService.delete(data.idQuotationNote).subscribe({
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

  saveParameter() {
    this.reloadID();
    if (!this.quotationId) {
      Alert.warning(
        'Debe crear una cotización antes de guardar los parámetros adicionales'
      );
      return;
    }

    const update: QuotationEconomicProposalDto = {
      idQuotation: this.quotationId,
      approvalObservation: this.parametrosAdicionalesForm.get(
        'approvalObservation'
      )?.value,
      contactOT: this.parametrosAdicionalesForm.get('contactOT')?.value,
      implementationManager: this.parametrosAdicionalesForm.get(
        'implementationManager'
      )?.value,
      notes: this.parametrosAdicionalesForm.get('notes')?.value,
      position: this.parametrosAdicionalesForm.get('position')?.value,
      attention: this.parametrosAdicionalesForm.get('attention')?.value,
      email: this.parametrosAdicionalesForm.get('email')?.value,
    };
    this.spinner.show();
    this.cotizacionesService.updateQuotationEconomicProposal(update).subscribe({
      next: (response: ResponseDto) => {
        this.spinner.hide();
        Alert.toastSWMessage('success', response.message);
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
      },
    });
  }
}
