import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  ConsultNotificationDto,
  NotificationEmailDto,
  SendNotificationDto,
} from 'src/app/feature/catalogos/notificaciones/models/notificaciones';
import { NotificacionesService } from 'src/app/feature/catalogos/notificaciones/service/notificaciones.service';
import { Alert } from 'src/app/helpers/alert_helper';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css'],
})
export class NotificacionComponent {
  dataSource: MatTableDataSource<string> = new MatTableDataSource<string>();
  displayedColumns = ['email'];
  mostrarEmails: boolean = false;
  notificacionForm: FormGroup;
  constructor(
    public dialoref: MatDialogRef<NotificacionComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      IdQuotation: number;
      Notificaciones: ConsultNotificationDto[];
    },
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private notificacionesService: NotificacionesService
  ) {
    this.notificacionForm = this._formBuilder.group({
      idNotificacion: [null, [Validators.required]],
    });
  }

  notificacionSeleccionada() {
    const notificationsId: number[] =
      this.notificacionForm.get('idNotificacion')?.value;

    let listEmail: string[] = [];
    notificationsId.forEach((id) => {
      const notificacion = this.data.Notificaciones.find((x) => x.id == id);
      if (notificacion?.notificationEmails.length) {
        notificacion.notificationEmails.forEach((email) => {
          listEmail.push(email.email);
        });
      }
    });

    if (listEmail.length > 0) {
      this.mostrarEmails = true;
      const emails: string[] = Array.from(new Set(listEmail));

      this.dataSource.data = emails;
    } else {
      this.mostrarEmails = false;
    }
  }

  enviarNotificacion() {
    const send: SendNotificationDto = {
      notificationIds: this.notificacionForm.get('idNotificacion')?.value,
      idQuotation: this.data.IdQuotation,
    };
    this.spinner.show();
    this.notificacionesService.sendNotification(send).subscribe({
      next: (result) => {
        Alert.toastSWMessage('success', result.message);
        this.spinner.hide();
        this.dialoref.close();
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
      },
    });
  }
}
