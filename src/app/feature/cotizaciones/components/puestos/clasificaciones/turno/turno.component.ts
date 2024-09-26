import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom } from 'rxjs';
import {
  ShiftDetailDto,
  ShiftQuotationGetDto,
} from 'src/app/feature/catalogos/subcargos/models/elementsProvider';
import { Turnos } from 'src/app/feature/catalogos/turnos/models/turnos';
import { TurnosService } from 'src/app/feature/catalogos/turnos/service/turnos.service';
import { PrincipalInfoSubChargesQuotationDto } from 'src/app/feature/cotizaciones/models/principalInfoSubChargesQuotationDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { SeleccionarTurnoComponent } from './seleccionar-turno/seleccionar-turno.component';
import { ResponseDto } from 'src/app/models/responseDto';
import { Utiles } from 'src/app/helpers/utiles_helpers';
import { EsquemasService } from 'src/app/feature/catalogos/turnos/service/esquemas.service';
import {
  EsqeuemaHorarioPersona,
  SchemesEditDto,
} from 'src/app/feature/catalogos/turnos/models/horarios';
import { VerEsquemaComponent } from './ver-esquema/ver-esquema.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CotizacionesService } from 'src/app/feature/cotizaciones/service/cotizaciones.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.css'],
})
export class TurnoComponent implements OnInit, AfterViewInit {
  @Input()
  principalInfoSubChargesQuotation: PrincipalInfoSubChargesQuotationDto;
  displayedColumns = ['startHour', 'day'];
  dataSource: MatTableDataSource<ShiftDetailDto> =
    new MatTableDataSource<ShiftDetailDto>();
  shiftQuotations: ShiftQuotationGetDto[] = [];
  turnoSeleccionado: string = '';
  shiftId: number = 0;
  turnos: Turnos[] = [];
  statusName: string;
  isStatusDisabled: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private matDialog: MatDialog,
    private spinner: NgxSpinnerService,
    private turnosService: TurnosService,
    private esquemasService: EsquemasService,
    private cotizacionesService: CotizacionesService
  ) {}

  ngOnInit(): void {
    this.shiftQuotations =
      this.principalInfoSubChargesQuotation.subChargesQuotation?.shiftQuotations!;
    if (this.shiftQuotations.length) {
      this.turnoSeleccionado = this.shiftQuotations[0].shiftName;
      this.dataSource.data = this.shiftQuotations[0].shiftDetails;
      this.shiftId = this.shiftQuotations[0].shiftId;
    }

    this.statusName = this.cotizacionesService.getStatusName();
    this.cotizacionesService.statusName$.subscribe((statusName) => {
      this.statusName = statusName;
    });
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

  async openDialog() {
    if (this.turnos.length > 0) {
      this.dialogResult();
    } else {
      try {
        this.spinner.show();
        this.turnos = await lastValueFrom(this.turnosService.getTurnos());
        this.spinner.hide();
      } catch (error) {
        console.error(error);
        Alert.error(
          'Ha ocurrido un error interno, por favor volverlo a intentar.'
        );
      }
      if (this.turnos.length > 0) {
        this.dialogResult();
      } else {
        Alert.warning(
          'Por favor registrar primero los turnos, para seleccionar el turno en la cotización.'
        );
      }
    }
  }

  dialogResult(): void {
    if (this.shiftQuotations.length) {
      this.shiftId = this.shiftQuotations[0].shiftId;
    }

    this.matDialog
      .open(SeleccionarTurnoComponent, {
        width: '60%',
        data: {
          turnos: this.turnos,
          subChargesQuotationId: this.principalInfoSubChargesQuotation.id,
          idShift: this.shiftId,
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

  getAll() {
    this.spinner.show();
    this.turnosService
      .getAllShiftQuotationBySubChargesQuotation(
        this.principalInfoSubChargesQuotation.id
      )
      .subscribe({
        next: (response: ResponseDto) => {
          if (response.result?.length) {
            this.shiftQuotations = response.result as ShiftQuotationGetDto[];
            this.turnoSeleccionado = this.shiftQuotations[0].shiftName;
            this.dataSource.data = this.shiftQuotations[0].shiftDetails;
            this.shiftId = this.shiftQuotations[0].shiftId;
            this.cotizacionesService.reloadExtraHour();
          }
          this.spinner.hide();
        },
        error: (error) => {
          console.error(error);
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }

  getDayInitial(day: string): string {
    return Utiles.getDayInitial(day);
  }

  verEsquema() {
    this.spinner.show();
    this.esquemasService.generateSchemesByShiftId(this.shiftId).subscribe({
      next: (response: SchemesEditDto) => {
        if (response.generatedSchemas.length > 0) {
          this.openDialogVerEsquema(response.generatedSchemas);
        } else {
          Alert.warning(
            'No hay esquemas disponibles en el turno seleccionado, por favor revisar catálogo de turnos'
          );
        }
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
      },
    });
  }

  openDialogVerEsquema(esquemas: EsqeuemaHorarioPersona[]): void {
    this.matDialog
      .open(VerEsquemaComponent, {
        width: '60%',
        data: {
          esquemas: esquemas,
        },
      })
      .afterClosed()
      .subscribe({
        next: (value) => {},
      });
  }
}
