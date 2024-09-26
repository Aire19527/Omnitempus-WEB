import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { FormEsquemaHorarioTrabajoComponent } from '../form-esquema-horario-trabajo/form-esquema-horario-trabajo.component';
import { EsquemasService } from '../../service/esquemas.service';
import { EsqeuemaHorarioPersona } from '../../models/horarios';
import { Alert } from 'src/app/helpers/alert_helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css'],
})
export class PersonasComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
  displayedColumns = ['persona', 'acciones'];
  listPersonas: number;
  esquemaFormGroup: FormGroup;
  personas: { persona: string }[] = [];
  schemeList: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  changeUrl: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PersonasComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private spinner: NgxSpinnerService,
    private esquemasService: EsquemasService
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
    this.getSchemesGetById();
  }
  getSchemesGetById(): void {
    const esquemaId = this.data.esquemaId;
    this.esquemasService.getSchemesGetById(esquemaId).subscribe({
      next: (res: any) => {
        this.esquemaFormGroup.patchValue(res);
        this.generatePersons();
      },
      error: (error) => {
        Alert.errorHttp(error);
      },
    });
  }

  generatePersons(): void {
    const personRequired =
      this.esquemaFormGroup.get('personRequired')?.value || 0;
    const roundedPersonRequired = Math.ceil(personRequired);
    this.personas = Array.from(
      { length: roundedPersonRequired },
      (_, index) => ({
        persona: `Persona ${index + 1}`,
      })
    );

    this.dataSource = new MatTableDataSource(this.personas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  generatedSchemes() {
    const esquemaId = this.data.esquemaId;
    this.spinner.show();
    this.esquemasService.generatedSchemes(esquemaId).subscribe({
      next: (res: EsqeuemaHorarioPersona[]) => {
        this.schemeList = res;
        this.schemeList.sort((a, b) => a.person.localeCompare(b.person));
        this.closeModal(true);
        Alert.toastSWMessage('success', 'Esquema generado correctamente');
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
      },
    });
  }

  showSchedule(action: string, personIndex?: number): void {
    const esquemaId = this.data.esquemaId;
    this.changeUrl = false;
    const ids = this.data.ids;
    const selectedPersonId =
      personIndex !== undefined ? ids[personIndex] : null;
    const dialogRef = this.matDialog.open(FormEsquemaHorarioTrabajoComponent, {
      width: '60%',
      data: { title: action, personIndex, esquemaId, selectedPersonId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeUrl = result;
      }
    });
  }

  closeModal(isModified: boolean) {
    if (isModified) {
      this.dialogRef.close(this.schemeList);
    } else {
      this.dialogRef.close();
    }
  }
}
