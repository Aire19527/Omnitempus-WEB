import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificacionesService } from '../../service/notificaciones.service';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import {
  AddNotificationEmailDto,
  NotificationEmailDto,
} from '../../models/notificaciones';

@Component({
  selector: 'app-form-correos',
  templateUrl: './form-correos.component.html',
  styleUrls: ['./form-correos.component.css'],
})
export class FormCorreosComponent {
  emailFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormCorreosComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      notificationId: number;
      dataEmail: NotificationEmailDto;
    },
    private _formBuilder: FormBuilder,
    private notificacionesService: NotificacionesService,
    private spinner: NgxSpinnerService
  ) {
    this.emailFormGroup = this._formBuilder.group({
      notificationEmailId: 0,
      notificationId: 0,
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(300),
          Validators.pattern(
            '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],
    });

    if (this.data.dataEmail) {
      this.emailFormGroup.patchValue(this.data.dataEmail);
    }
  }

  ngOnInit(): void {}

  saveMail() {
    this.emailFormGroup.markAllAsTouched();
    if (this.emailFormGroup.invalid) {
      return;
    }
    if (this.data.dataEmail) {
      this.updateNotificationEmail();
    } else {
      this.addNotificationEmail();
    }
  }

  addNotificationEmail() {
    this.spinner.show();
    const add: AddNotificationEmailDto = {
      email: this.emailFormGroup.get('email')?.value,
      notificationId: this.data.notificationId,
    };
    this.notificacionesService.addNotificationEmail(add).subscribe({
      next: (result: ResponseDto) => {
        Alert.toastSWMessage('success', result.message);
        this.dialogRef.close(true);
        this.spinner.hide();
      },
      error: (error) => {
        Alert.errorHttp(error);
        this.spinner.hide();
      },
    });
  }

  updateNotificationEmail() {
    this.spinner.show();
    // const update: NotificationDto = {
    //   nameArea: this.notificationsFormGroup.get('nameArea')?.value,
    //   notificationTypeId:
    //     this.notificationsFormGroup.get('notificationTypeId')?.value,
    //   id: this.notificationsFormGroup.get('id')?.value,
    // };
    this.notificacionesService
      .updateNotificationEmail(this.emailFormGroup.value)
      .subscribe({
        next: (result: ResponseDto) => {
          Alert.toastSWMessage('success', result.message);
          this.dialogRef.close(true);
          this.spinner.hide();
        },
        error: (error) => {
          Alert.errorHttp(error);
          this.spinner.hide();
        },
      });
  }
}
