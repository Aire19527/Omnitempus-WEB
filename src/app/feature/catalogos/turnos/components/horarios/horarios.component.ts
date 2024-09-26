import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Turnos } from '../../models/turnos';
import { FormHorariosComponent } from '../form-horarios/form-horarios.component';
import { MatSort } from '@angular/material/sort';
import { Alert } from 'src/app/helpers/alert_helper';
import { HorariosService } from '../../service/horarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Horarios, SchemesEditDto } from '../../models/horarios';
import { ResponseDto } from 'src/app/models/responseDto';
import { EsquemasService } from '../../service/esquemas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EsquemaEventService } from '../../service/horarioesquema.service';
import { Utiles } from 'src/app/helpers/utiles_helpers';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css'],
})
export class HorariosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | null;
  @ViewChild(MatSort) sort: MatSort | null;
  @ViewChild(MatStepper) stepper: MatStepper;
  @Output() dataLength = new EventEmitter();
  displayedColumns = ['startHour', 'day', 'acciones'];
  horarioList: number;
  changeUrl: boolean = false;
  shiftId: string;
  shiftDetailsList: Horarios[] = [];
  allDaysOfWeek: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  newEsquemaId: string;
  hasData: boolean = false;
  dataSource!: MatTableDataSource<any>;
  lengthData: number = 0;
  postingScheme: boolean = false;
  nameShift: string;
  schemePosted: boolean = false;

  constructor(
    private horariosService: HorariosService,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private spinner: NgxSpinnerService,
    private esquemaService: EsquemasService,
    public esquemaEventService: EsquemaEventService
  ) {}

  ngOnInit(): void {
    this.shiftId = this.route.snapshot.params['id'];
    this.esquemaEventService.stepChange$.subscribe((step) => {
      if (step === 2 && !this.schemePosted && this.hasData) {
        this.postScheme();
        this.schemePosted = true;
      }
    });

    this.esquemaEventService.shiftId$.subscribe((id) => {
      if (id) {
        this.shiftId = id.toString();
        this.getShiftDetailsById();
      }
    });

    if (this.shiftId) {
      this.getShiftDetailsById();
    }
    this.esquemaEventService.getShiftSchemeName().subscribe((nameShift) => {
      this.nameShift = nameShift;
    });
  }

  getShiftDetailsById(): void {
    this.horariosService
      .getShiftDetailsByShift(parseInt(this.shiftId))
      .subscribe({
        next: (res: Horarios[]) => {
          this.lengthData = res.length;
          this.dataLength.emit(this.lengthData);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.hasData = res.length > 0;
        },
        error: (error) => {
          Alert.errorHttp(error);
        },
      });
  }

  openDialog(action: string, data?: Turnos): void {
    this.changeUrl = false;
    const dataSend = { data, shiftId: this.shiftId };
    const dialogRef = this.matDialog.open(FormHorariosComponent, {
      data: { title: action, dataSend },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeUrl = result;
        this.getShiftDetailsById();
      }
    });
  }

  dataEdit(data: Turnos) {
    this.openDialog('editar', data);
  }

  deleteData(data: any): void {
    Alert.questionConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.horariosService.deleteShiftDetails(data.id).subscribe({
          next: (response: ResponseDto) => {
            this.getShiftDetailsById();
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

  postScheme() {
    if (this.postingScheme) {
      return;
    }
    this.postingScheme = true;
    const shiftIdNumber = parseInt(this.shiftId ?? '');
    if (!isNaN(shiftIdNumber) && this.lengthData > 0) {
      this.spinner.show();
      this.esquemaService.postSchemes(shiftIdNumber).subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
            this.spinner.hide();
            this.generateSchemesByShiftId(shiftIdNumber);
          } else {
            this.spinner.hide();
            Alert.toastSWMessage('warning', response.message);
          }

          this.postingScheme = false;
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
          this.postingScheme = false;
        },
      });
    }
  }

  getDayInitial(day: string): string {
    return Utiles.getDayInitial(day);
  }

  generateSchemesByShiftId(shiftId: number) {
    this.spinner.show();
    this.esquemaService.generateSchemesByShiftId(shiftId).subscribe({
      next: (response: SchemesEditDto) => {
        this.esquemaEventService.notifyEsquemaId(response.scheme.id);
        this.esquemaEventService.notifyGeneratedSchemas(
          response.generatedSchemas
        );
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
      },
    });
  }
}
