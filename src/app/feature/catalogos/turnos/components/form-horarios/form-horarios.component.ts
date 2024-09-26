import { Component, OnInit, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HorariosService } from '../../service/horarios.service';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-horarios',
  templateUrl: './form-horarios.component.html',
  styleUrls: ['./form-horarios.component.css'],
})
export class FormHorariosComponent implements OnInit {
  shiftDetailsFormGroup: FormGroup;
  action: string | undefined;
  titleButton: string;
  daysList: string = '';
  
  isActiveMonday: boolean = false;
  isActiveTuesday: boolean = false;
  isActiveWednesday: boolean = false;
  isActiveThursday: boolean = false;
  isActiveFriday: boolean = false;
  isActiveSaturday: boolean = false;
  isActiveSunday: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FormHorariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private horariosService: HorariosService,
    private spinner: NgxSpinnerService
  ) {
    this.action = data.title;
    this.shiftDetailsFormGroup = this._formBuilder.group({
      id: 0,
      shiftId: 0,
      day: [''],
      startHour: ['', Validators.required],
      endHour: ['', [Validators.required]],
    });

    this.shiftId?.setValue(parseInt(this.data.dataSend.shiftId));
  }

  ngOnInit(): void {
    this.onAction();
    this.setData();
  }

  setData(): void {
    if (this.data.dataSend.data) {
      this.shiftDetailsFormGroup.patchValue(this.data.dataSend.data);
      this.daysList = this.data.dataSend.data.day;
      this.daysList.split(',').forEach((day: string) => {
        this.validateDay(day);
      });
    }
  }

  saveUpdateHours(): void {
    this.shiftDetailsFormGroup.markAllAsTouched();
    if (this.shiftDetailsFormGroup.invalid) {
      return;
    }
    this.shiftDetailsFormGroup.get('day')?.setValue(this.daysList);
    this.convertHours();
    if (this.action === 'crear') {
      this.spinner.show();
      this.horariosService
        .saveShiftDetails([this.shiftDetailsFormGroup.value])
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
            this.spinner.hide();
            Alert.errorHttp(error);
          },
        });
    } else if (this.action === 'editar') {
      this.spinner.show();
      this.horariosService
        .upadteShiftDetails([this.shiftDetailsFormGroup.value])
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
            this.spinner.hide();
            Alert.errorHttp(error);
          },
        });
    }
  }

  formatTime(value: string): string {
    if (!value) {
      return '';
    }
    const hours = value.substring(0, 2);
    const minutes = value.substring(2);
    return `${hours}:${minutes}`.replace('::', ':');
  }

  convertHours() {
    const startHourValue = this.startHour?.value;
    const endHourValue = this.endHour?.value;
    const startHourFormatted = this.formatTime(startHourValue);
    const endHourFormatted = this.formatTime(endHourValue);
    this.shiftDetailsFormGroup.get('startHour')?.setValue(startHourFormatted);
    this.shiftDetailsFormGroup.get('endHour')?.setValue(endHourFormatted);
  }

  addDays(day: string): void {
    const index = this.daysList.indexOf(day);
    if (index !== -1) {
      this.daysList = this.daysList
        .split(',')
        .filter((d) => d !== day)
        .join(',');
    } else {
      if (this.daysList) {
        this.daysList += ',' + day;
      } else {
        this.daysList = day;
      }
    }
    this.validateDay(day);
  }

  validateDay(day: string): void {
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

  close(isEdit: boolean): void {
    this.dialogRef.close(isEdit);
  }

  onAction(): void {
    if (this.action === 'crear') {
      this.titleButton = 'Guardar';
    } else if (this.action === 'editar') {
      this.titleButton = 'Guardar';
    }
  }

  get shiftId(): AbstractControl | null {
    return this.shiftDetailsFormGroup.get('shiftId');
  }
  get day(): AbstractControl | null {
    return this.shiftDetailsFormGroup.get('day');
  }

  get startHour(): AbstractControl | null {
    return this.shiftDetailsFormGroup.get('startHour');
  }
  get endHour(): AbstractControl | null {
    return this.shiftDetailsFormGroup.get('endHour');
  }
}
