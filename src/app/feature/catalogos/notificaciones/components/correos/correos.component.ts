import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormCorreosComponent } from '../form-correos/form-correos.component';
import { Email } from '../../models/email';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';
import { NotificacionesService } from '../../service/notificaciones.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import {
  ConsultNotificationDto,
  NotificationEmailDto,
} from '../../models/notificaciones';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-correos',
  templateUrl: './correos.component.html',
  styleUrls: ['./correos.component.css'],
})
export class CorreosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | null;
  @ViewChild(MatSort) sort: MatSort | null;
  @ViewChild(MatStepper) stepper: MatStepper;

  @Input() data?: ConsultNotificationDto;

  displayedColumns = ['email', 'acciones'];

  listEmail: NotificationEmailDto[] = [];
  dataSource: MatTableDataSource<NotificationEmailDto> =
    new MatTableDataSource<NotificationEmailDto>();

  constructor(
    private matDialog: MatDialog,
    private spinner: NgxSpinnerService,
    private notificacionesService: NotificacionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getByEmail();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getByEmail(): void {
    if (this.data) {
      this.listEmail = this.data.notificationEmails;
      this.dataSource.data = this.listEmail;
    }
  }

  openDialog(data?: NotificationEmailDto): void {
    if (!this.data) {
      Alert.warning(
        'Debe guardar la información básica, antes de agregar los correos.'
      );
      return;
    }

    const dialogRef = this.matDialog.open(FormCorreosComponent, {
      width: '50%',
      data: {
        notificationId: this.data.id,
        dataEmail: data,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllNotificationType();
      }
    });
  }

  dataEdit(data: NotificationEmailDto) {
    this.openDialog(data);
  }

  deleteNotificationsEmail(data: NotificationEmailDto): void {
    Alert.questionConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.notificacionesService
          .deleteNotificationEmail(data.notificationEmailId)
          .subscribe({
            next: (response: ResponseDto) => {
              this.listEmail = this.listEmail.filter(
                (x) => x.notificationEmailId != data.notificationEmailId
              );
              this.dataSource.data = this.listEmail;
              Alert.toastSWMessage('success', response.message);
            },
            error: (err: any) => {
              console.error(err);
              Alert.errorHttp(err);
            },
          });
      }
    });
  }

  getAllNotificationType() {
    this.spinner.show();
    this.notificacionesService
      .getAllNotificationEmail(this.data?.id!)
      .subscribe({
        next: (result: NotificationEmailDto[]) => {
          this.listEmail = result;
          this.dataSource.data = this.listEmail;
          this.spinner.hide();
        },
        error: (error) => {
          Alert.errorHttp(error);
          this.spinner.hide();
        },
      });
  }

  goBack() {
    this.router.navigate(['catalogo/notificaciones']);
  }
}
