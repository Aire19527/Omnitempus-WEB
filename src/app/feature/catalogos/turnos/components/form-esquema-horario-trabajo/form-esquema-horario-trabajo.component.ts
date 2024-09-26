import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { EsquemasService } from '../../service/esquemas.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { HorarioPersona, TimeSlot } from '../../models/esquemas';

@Component({
  selector: 'app-form-esquema-horario-trabajo',
  templateUrl: './form-esquema-horario-trabajo.component.html',
  styleUrls: ['./form-esquema-horario-trabajo.component.css'],
})
export class FormEsquemaHorarioTrabajoComponent implements OnInit {
  hourWorkformGroups: FormGroup[] = [];
  hourWorkformGroup: FormGroup;

  titleButton: string;
  daysList: string = '';
  schemeList: any[] = [];

  days: string[] = [];
  isActiveMonday: boolean = false;
  isActiveTuesday: boolean = false;
  isActiveWednesday: boolean = false;
  isActiveThursday: boolean = false;
  isActiveFriday: boolean = false;
  isActiveSaturday: boolean = false;
  isActiveSunday: boolean = false;
  hidebutton: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FormEsquemaHorarioTrabajoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private esquemasService: EsquemasService,
    private cdr: ChangeDetectorRef
  ) {
    this.hourWorkformGroups = [];
    this.addDay();
  }

  ngOnInit(): void {
    this.extraHoursChanges();
    this.getWorkSchedulePerson();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getWorkSchedulePerson();
    });
  }

  getWorkSchedulePerson() {
    this.esquemasService
      .getSchemesWorkSchedulePerson(this.data.selectedPersonId)
      .subscribe({
        next: (res: any) => {
          if (Array.isArray(res.result)) {
            res.result.forEach((scheme: any, index: number) => {
              const newFormGroup = this._formBuilder.group({
                ...scheme,
                startHourExtra: [
                  scheme.startHourExtra || null,
                  [Validators.min(1), Validators.max(24)],
                ],
              });

              this.hourWorkformGroups[index] = newFormGroup;
              newFormGroup.get('extraHours')?.valueChanges.subscribe(() => {
                this.updateStartHourExtraControl(index);
              });
              this.updateStartHourExtraControl(index);
            });
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }

  addDay() {
    this.hourWorkformGroup = this._formBuilder.group({
      id: 0,
      schemesPersonId: 0,
      day: [''],
      startHour: ['', Validators.required],
      endHour: ['', Validators.required],
      extraHours: null,
      startHourExtra: [
        { value: null, disabled: false },
        [Validators.min(1), Validators.max(24)],
      ],
    });
    this.hourWorkformGroups.push(this.hourWorkformGroup);
    this.extraHoursChanges();
  }

  deleteDay(index: number) {
    if (this.hourWorkformGroups.length === 1) {
      Alert.deleteConfirm(
        '¿Estás seguro de eliminar el único horario de la persona?'
      ).then((result) => {
        if (result.isConfirmed) {
          this.hourWorkformGroups.splice(index, 1);
          this.saveUpdateHourWork();
        }
      });
    } else {
      this.hourWorkformGroups.splice(index, 1);
    }
  }

  extraHoursChanges() {
    this.hourWorkformGroups.forEach((formGroup, index) => {
      formGroup.get('extraHours')?.valueChanges.subscribe(() => {
        this.updateStartHourExtraControl(index);
      });
    });
  }

  saveUpdateHourWork() {
    const formDataArray: HorarioPersona[] = [];
    this.hourWorkformGroups.forEach((formGroup) => {
      const formData = { ...formGroup.value };
      formData.startHour = this.formatTime(formData.startHour);
      formData.endHour = this.formatTime(formData.endHour);
      const selectedPersonId = this.data.selectedPersonId;
      formData.schemesPersonId = selectedPersonId;
      formDataArray.push(formData);
    });

    let isValidForm: boolean = true;
    this.hourWorkformGroups.forEach((hourWorkformGroup) => {
      hourWorkformGroup.markAllAsTouched();
      if (hourWorkformGroup.invalid) {
        isValidForm = false;
      }
    });

    if (!isValidForm) {
      Alert.warning('Por favor completar los campos obligatorios.');
      return;
    }

    const emptyOrNullError = this.validateEmptyOrNullEntries(formDataArray);
    if (emptyOrNullError) {
      Alert.warning(emptyOrNullError);
      return;
    }

    const timeSlots = this.mapToTimeSlots(formDataArray);
    const overlaps = this.findOverlappingTimeSlots(timeSlots);
    if (overlaps.length > 0) {
      const errorMessage = this.generateOverlapErrorTable(overlaps);
      Alert.warningHtml('Alerta cruce de horario', errorMessage);
      return;
    }

    this.spinner.show();
    this.esquemasService
      .postSchemesWorkSchedulePerson(formDataArray)
      .subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
          } else {
            Alert.toastSWMessage('warning', response.message);
          }
          this.close(true);
          this.spinner.hide();
        },
        error: (error) => {
          console.error(error);
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }

  validateEmptyOrNullEntries(
    slots: { day: string; startHour: string; endHour: string }[]
  ): string | null {
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      if (!slot.day) {
        return `El campo 'Días de la semana' en el registro ${
          i + 1
        } está vacío o es nulo. Por favor, complete este campo.`;
      }
      if (!slot.startHour) {
        return `El campo 'Hora de Inicio' en el registro ${
          i + 1
        } está vacío o es nulo. Por favor, complete este campo.`;
      }
      if (!slot.endHour) {
        return `El campo 'Hora de Fin' en el registro ${
          i + 1
        } está vacío o es nulo. Por favor, complete este campo.`;
      }
    }
    return null;
  }

  mapToTimeSlots(slots: HorarioPersona[]): TimeSlot[] {
    return slots.map((slot) => ({
      day: slot.day,
      startHour: slot.startHour,
      endHour:
        slot.endHour === '00:00' || slot.endHour === '00:00:00'
          ? '23:59:59'
          : slot.endHour,
    }));
  }

  generateOverlapErrorTable(
    overlaps: {
      day: string;
      conflictingSlots: { startHour: string; endHour: string }[];
    }[]
  ): string {
    let tableContent = `<table style="width: 100%; border-collapse: collapse;">
                          <thead>
                            <tr style="text-align: left; border-bottom: 1px solid #ddd;">
                              <th>Día</th>
                              <th>Hora Inicio</th>
                              <th>Hora Fin</th>
                            </tr>
                          </thead>
                          <tbody>`;

    overlaps.forEach((overlap) => {
      overlap.conflictingSlots.forEach((slot, index) => {
        tableContent += `<tr style="border-bottom: 1px solid #ddd;">
                          ${
                            index === 0
                              ? `<td style="padding: 8px;" rowspan="${overlap.conflictingSlots.length}">${overlap.day}</td>`
                              : ''
                          }
                          <td style="padding: 8px;">${slot.startHour}</td>
                          <td style="padding: 8px;">${slot.endHour}</td>
                         </tr>`;
      });
    });

    tableContent += `</tbody></table>`;

    return `Se encontraron cruce de horarios en los siguientes días y horas:<br><br>${tableContent}`;
  }

  close(isEdit: boolean) {
    this.dialogRef.close(isEdit);
  }

  formatTime(value: string): string {
    if (!value) {
      return '';
    }
    const hours = value.substring(0, 2);
    const minutes = value.substring(2);
    return `${hours}:${minutes}`.replace('::', ':');
  }

  addDays(day: string, formIndex: number): void {
    let selectedDays = this.hourWorkformGroups[formIndex]
      .get('day')
      ?.value.split(',');
    if (!selectedDays[0]) {
      selectedDays = [];
    }
    const index = selectedDays.indexOf(day);

    if (index !== -1) {
      selectedDays.splice(index, 1);
    } else {
      selectedDays.push(day);
    }
    this.validateDay(day);
    this.hourWorkformGroups[formIndex]
      .get('day')
      ?.setValue(selectedDays.join(','));
    this.updateStartHourExtraControl(formIndex);
  }

  isDaySelectedInOtherForms(day: string, currentFormIndex: number): boolean {
    let daySelectedInOtherForms = false;
    this.hourWorkformGroups.forEach((formGroup, index) => {
      if (index !== currentFormIndex) {
        const selectedDays = formGroup.get('day')?.value.split(',');
        if (selectedDays && selectedDays.includes(day)) {
          daySelectedInOtherForms = true;
        }
      }
    });

    return daySelectedInOtherForms;
  }

  updateStartHourExtraControl(formIndex: number) {
    const extraHoursControl =
      this.hourWorkformGroups[formIndex].get('extraHours');
    const startHourExtraControl =
      this.hourWorkformGroups[formIndex].get('startHourExtra');

    if (extraHoursControl && startHourExtraControl) {
      const extraHoursValue = extraHoursControl.value;
      if (extraHoursValue === false) {
        startHourExtraControl.disable();
        startHourExtraControl.clearValidators();
      } else {
        startHourExtraControl.enable();
        startHourExtraControl.setValidators([
          Validators.required, // Validador requerido
          Validators.min(1), // Validar que sea al menos 1
          Validators.max(24), // Validar que sea como máximo 24
        ]);
      }
    }
  }

  validateDay(day: string) {
    switch (day) {
      case 'Lunes':
        this.isActiveMonday = !this.isActiveMonday;
        break;
      case 'Martes':
        this.isActiveTuesday = !this.isActiveTuesday;
        break;
      case 'Miércoles':
        this.isActiveWednesday = !this.isActiveWednesday;
        break;
      case 'Jueves':
        this.isActiveThursday = !this.isActiveThursday;
        break;
      case 'Viernes':
        this.isActiveFriday = !this.isActiveFriday;
        break;
      case 'Sábado':
        this.isActiveSaturday = !this.isActiveSaturday;
        break;
      case 'Domingo':
        this.isActiveSunday = !this.isActiveSunday;
        break;
      default:
        break;
    }
  }

  get extraHours() {
    return this.hourWorkformGroup.get('extraHours');
  }
  get startHour() {
    return this.hourWorkformGroup.get('startHour');
  }
  get endHour() {
    return this.hourWorkformGroup.get('endHour');
  }

  findOverlappingTimeSlots(
    slots: { day: string; startHour: string; endHour: string }[]
  ) {
    const dayMap: { [day: string]: { startHour: string; endHour: string }[] } =
      {};
    const overlaps: {
      day: string;
      conflictingSlots: { startHour: string; endHour: string }[];
    }[] = [];

    for (const slot of slots) {
      const days = slot.day.split(',');

      for (const day of days) {
        if (!dayMap[day]) {
          dayMap[day] = [];
        }

        const start = new Date(`1970-01-01T${slot.startHour}Z`);
        const end = new Date(`1970-01-01T${slot.endHour}Z`);

        // Si el final del turno es menor que el inicio, significa que cruza la medianoche
        if (end <= start) {
          // Asumimos que el turno cruza al día siguiente
          const nextDay = this.getNextDay(day); // Función auxiliar para obtener el siguiente día de la semana

          // Dividimos el horario en dos partes: hasta las 23:59 del día actual y desde 00:00 del siguiente día
          this.checkOverlapsForDay(
            day,
            { startHour: slot.startHour, endHour: '23:59:59' },
            dayMap,
            overlaps
          );

          this.checkOverlapsForDay(
            nextDay,
            { startHour: '00:00:00', endHour: slot.endHour },
            dayMap,
            overlaps
          );
        } else {
          // Si no cruza la medianoche, solo revisamos el día actual
          this.checkOverlapsForDay(day, slot, dayMap, overlaps);
        }
      }
    }

    return overlaps;
  }

  // Función auxiliar para revisar solapamientos en un día específico
  checkOverlapsForDay(
    day: string,
    slot: { startHour: string; endHour: string },
    dayMap: { [day: string]: { startHour: string; endHour: string }[] },
    overlaps: {
      day: string;
      conflictingSlots: { startHour: string; endHour: string }[];
    }[]
  ) {
    if (!dayMap[day]) {
      dayMap[day] = [];
    }

    for (const existingSlot of dayMap[day]) {
      if (
        this.areHoursOverlapping(
          existingSlot.startHour,
          existingSlot.endHour,
          slot.startHour,
          slot.endHour
        )
      ) {
        overlaps.push({
          day: day,
          conflictingSlots: [
            {
              startHour: existingSlot.startHour,
              endHour: existingSlot.endHour,
            },
            { startHour: slot.startHour, endHour: slot.endHour },
          ],
        });
      }
    }

    dayMap[day].push({ startHour: slot.startHour, endHour: slot.endHour });
  }

  // Función auxiliar para obtener el siguiente día de la semana
  getNextDay(day: string): string {
    const daysOfWeek: string[] = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    const index = daysOfWeek.indexOf(day);
    return daysOfWeek[(index + 1) % daysOfWeek.length]; // Cicla al siguiente día
  }

  // Función para detectar solapamientos de horas
  areHoursOverlapping(
    startHour1: string,
    endHour1: string,
    startHour2: string,
    endHour2: string
  ): boolean {
    const start1 = new Date(`1970-01-01T${startHour1}Z`);
    let end1 = new Date(`1970-01-01T${endHour1}Z`);
    const start2 = new Date(`1970-01-01T${startHour2}Z`);
    let end2 = new Date(`1970-01-01T${endHour2}Z`);

    // Ajustar si el horario cruza la medianoche
    if (end1 <= start1) {
      end1 = new Date('1970-01-02T' + endHour1 + 'Z'); // Termina al día siguiente
    }

    if (end2 <= start2) {
      end2 = new Date('1970-01-02T' + endHour2 + 'Z'); // Termina al día siguiente
    }

    // Detectar cualquier solapamiento
    return start1 < end2 && start2 < end1;
  }
}
