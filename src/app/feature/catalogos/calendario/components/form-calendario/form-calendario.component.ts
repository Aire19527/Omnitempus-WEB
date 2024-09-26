import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarioService } from '../../service/calendario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { Location } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-form-calendario',
  templateUrl: './form-calendario.component.html',
  styleUrls: ['./form-calendario.component.css'],
})
export class FormCalendarioComponent implements OnInit {
  action: string | undefined;
  formCalendar: FormGroup;
  titleButton: string;

  constructor(
    public dialogRef: MatDialogRef<FormCalendarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private calendarioService: CalendarioService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private location: Location
  ) {
    this.action = data.title;
    this.formCalendar = this._formBuilder.group({
      id: 0,
      title: ['', [Validators.required, Validators.maxLength(100)]],
      date: [''],
    });
  }

  ngOnInit(): void {
    this.onAction();
    this.getHolidayById();
  }

  getHolidayById() {
    this.calendarioService
      .getHolidayById(parseInt(this.data.data.id))
      .subscribe({
        next: (res: any) => {
          this.formCalendar.patchValue(res);
        },
      });
  }

  saveUpdateCalendar() {
    this.formCalendar.markAllAsTouched();
    if (this.formCalendar.invalid) {
      return;
    }
    const selectedDate = new Date(this.formCalendar.value.date);
    selectedDate.setUTCHours(0, 0, 0, 0);

    const formattedDate = selectedDate.toISOString();
    const formData = { ...this.formCalendar.value, date: formattedDate };

    if (this.action === 'crear') {
      this.spinner.show();
      this.calendarioService.saveHoliday(formData).subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
          } else {
            Alert.toastSWMessage('warning', response.message);
          }
          this.closeModal();
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
    } else if (this.action === 'editar') {
      this.spinner.show();
      this.calendarioService.updateHoliday(formData).subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
          } else {
            Alert.toastSWMessage('warning', response.message);
          }
          this.closeModal();
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
    }
  }

  closeModal() {
    this.dialogRef.close(this.formCalendar.value);
  }

  onAction(): void {
    if (this.action === 'crear') {
      this.titleButton = 'Guardar';
    } else if (this.action === 'editar') {
      this.titleButton = 'Guardar';
    }
  }

  get title() {
    return this.formCalendar.get('title');
  }
  get date() {
    return this.formCalendar.get('date');
  }
}
