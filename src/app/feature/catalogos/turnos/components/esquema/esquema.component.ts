import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormEsquemaHorasComponent } from '../form-esquema-horas/form-esquema-horas.component';
import { FormEsquemaSemanaComponent } from '../form-esquema-semana/form-esquema-semana.component';
import { EsquemasService } from '../../service/esquemas.service';
import { PersonasComponent } from '../personas/personas.component';
import { Alert } from 'src/app/helpers/alert_helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseDto } from 'src/app/models/responseDto';
import { EsquemaEventService } from '../../service/horarioesquema.service';
import { EsqeuemaHorarioPersona } from '../../models/horarios';
import { MatStepper } from '@angular/material/stepper';
import { TurnosService } from '../../service/turnos.service';

@Component({
  selector: 'app-esquema',
  templateUrl: './esquema.component.html',
  styleUrls: ['./esquema.component.css'],
})
export class EsquemaComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator | null;
  @ViewChild(MatSort) sort: MatSort | null;
  @ViewChild(MatStepper) stepper: MatStepper;
  @Input() lengthTableShift: number;
  displayedColumns = ['variable', 'value', 'acciones'];
  listEsquemas: number;
  esquemaFormGroup: FormGroup;
  dataSource!: MatTableDataSource<any>;
  changeUrl: boolean = false;
  getIdScheme: number;
  schedulePersonList: EsqeuemaHorarioPersona[] = [];
  showTable: boolean = false;
  showTablePersonWeek: boolean = false;
  schemeList: any[] = [];
  shiftId: string;
  nameShift: string;

  constructor(
    private _formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private esquemasService: EsquemasService,
    private spinner: NgxSpinnerService,
    private esquemaEventService: EsquemaEventService,
    private turnosService: TurnosService
  ) {
    this.esquemaFormGroup = this._formBuilder.group({
      id: 0,
      shiftId: 0,
      hoursForDay: 0,
      daysForWeek: 0,
      hoursForWeek: 0,
      hoursDaysForPerson: 0,
      daysWeekForPerson: 0,
      hoursWeekForPerson: 0,
      personRequired: 0,
      shift: null,
      schemesPerson: null,
      createdAt: null,
      createdBy: null,
      lastModifiedByAt: null,
      lastModifiedBy: null,
      deletedByAt: null,
      deletedBy: null,
      newValues: null,
      oldValues: null,
      isActive: true,
    });
  }

  ngOnInit(): void {
    this.shiftId = this.route.snapshot.params['id'];
    this.esquemaEventService.esquemaId$.subscribe((id) => {
      this.getSchemesGetById(id);
    });

    this.getSchemesGenerated();
    this.esquemaEventService.getShiftSchemeName().subscribe((nameShift) => {
      this.nameShift = nameShift;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.lengthTableShift > 0) {
      this.showTablePersonWeek = true;
    } else {
      this.showTablePersonWeek = false;
    }
  }

  getSchemesGenerated() {
    this.esquemaEventService.generatedSchemas$.subscribe((generatedSchemas) => {
      if (generatedSchemas) {
        this.schedulePersonList = generatedSchemas;
        this.showTable = true;
      }
    });
  }

  getSchemesGetById(esquemaId: number): void {
    this.getIdScheme = esquemaId;
    this.esquemasService.getSchemesGetById(esquemaId).subscribe({
      next: (res: any) => {
        if (
          res &&
          res.daysForWeek !== undefined &&
          res.hoursForWeek !== undefined &&
          res.hoursForDay !== undefined
        ) {
          this.esquemaFormGroup.patchValue(res);
          const data = [
            { variable: 'Horas por día', value: this.hoursForDay?.value },
            { variable: 'Días por semana', value: this.daysForWeek?.value },
            { variable: 'Horas por semana', value: this.hoursForWeek?.value },
            {
              variable: 'Horas por día por persona',
              value: this.hoursDaysForPerson?.value
                ? this.hoursDaysForPerson?.value
                : '-',
            },
            {
              variable: 'Días por semana por persona',
              value: this.daysWeekForPerson?.value
                ? this.daysWeekForPerson?.value
                : '-',
            },
            {
              variable: 'Horas semanales por persona',
              value: this.hoursWeekForPerson?.value
                ? this.hoursWeekForPerson?.value
                : '-',
            },
            {
              variable: 'Personas requeridas',
              value: this.personRequired?.value
                ? this.personRequired?.value
                : '-',
            },
          ];
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (error) => {
        Alert.errorHttp(error);
      },
    });
  }

  showTablePersonRequired(action: string): void {
    this.postGenerateRequiredPeople();
  }

  postGenerateRequiredPeople() {
    this.spinner.show();
    this.esquemasService
      .postGenerateRequiredPeople(this.getIdScheme)
      .subscribe({
        next: (response: any[]) => {
          if (response && response.length > 0) {
            Alert.toastSWMessage('success', 'Registro exitoso');
            const ids: string[] = response.map((obj) => obj.id);
            this.openPersonasModal(ids);
          } else {
            Alert.toastSWMessage('warning', 'Respuesta no válida');
          }
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }

  openPersonasModal(ids: string[]): void {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(PersonasComponent, {
      width: '60%',
      data: { esquemaId: this.getIdScheme, ids: ids },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeUrl = true;
        this.schedulePersonList = result;
        this.showTable = true;
      }
    });
  }

  getNumberOfPersons(): number[] {
    const numberOfPersons = this.personRequired ? this.personRequired.value : 0;
    const quantityPerson = [];
    for (let i = 1; i <= numberOfPersons; i++) {
      quantityPerson.push(i);
    }
    return quantityPerson;
  }

  showEnterHourDayForPerson(): void {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(FormEsquemaHorasComponent, {
      width: '60%',
      data: {
        esquemaId: this.getIdScheme,
        hoursDaysForPerson: this.hoursDaysForPerson?.value || 8,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeUrl = result;
        this.getSchemesGetById(this.getIdScheme);
      }
    });
  }

  showEnterDayWeekForPerson(): void {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(FormEsquemaSemanaComponent, {
      width: '60%',
      data: {
        esquemaId: this.getIdScheme,
        daysWeekForPerson: this.daysWeekForPerson?.value || 7,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeUrl = result;
        this.getSchemesGetById(this.getIdScheme);
      }
    });
  }

  showActions(row: any): boolean {
    return (
      row.variable === 'Horas por día por persona' ||
      row.variable === 'Días por semana por persona' ||
      row.variable === 'Personas requeridas'
    );
  }

  calculatePersonRequired() {
    this.spinner.show();
    this.esquemasService
      .updateCalculateRequiredPeople(this.getIdScheme)
      .subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
          } else {
            Alert.toastSWMessage('warning', response.message);
          }
          this.spinner.hide();
          this.getSchemesGetById(this.getIdScheme);
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }

  goBack() {
    this.router.navigate(['/turnos']);
  }

  get hoursForDay() {
    return this.esquemaFormGroup.get('hoursForDay');
  }

  get daysForWeek() {
    return this.esquemaFormGroup.get('daysForWeek');
  }

  get hoursForWeek() {
    return this.esquemaFormGroup.get('hoursForWeek');
  }

  get hoursDaysForPerson() {
    return this.esquemaFormGroup.get('hoursDaysForPerson');
  }

  get daysWeekForPerson() {
    return this.esquemaFormGroup.get('daysWeekForPerson');
  }

  get hoursWeekForPerson() {
    return this.esquemaFormGroup.get('hoursWeekForPerson');
  }

  get personRequired() {
    return this.esquemaFormGroup.get('personRequired');
  }

  get id() {
    return this.esquemaFormGroup.get('id');
  }
}
