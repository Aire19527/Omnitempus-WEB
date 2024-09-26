import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificacionesService } from '../../service/notificaciones.service';

import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import {
  AddNotificationDto,
  ConsultNotificationDto,
  NotificationDto,
  NotificationTypeDto,
} from '../../models/notificaciones';

@Component({
  selector: 'app-form-notificaciones',
  templateUrl: './form-notificaciones.component.html',
  styleUrls: ['./form-notificaciones.component.css'],
})
export class FormNotificacionesComponent implements OnInit {
  @ViewChild('stepper') private myStepper: MatStepper;
  notificationsFormGroup: FormGroup;
  emailFormGroup: FormGroup;
  data: ConsultNotificationDto;
  notificationsTypes: NotificationTypeDto[] = [];
  isEditable = false;
  previousStepIndex: number = 0;
  routeId: string;
  notificationId: number;
  savingNotify: boolean = false;
  updateNotify: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private notificacionesService: NotificacionesService,
    private route: ActivatedRoute
  ) {
    this.notificationsFormGroup = this._formBuilder.group({
      id: 0,
      notificationTypeId: ['', [Validators.required]],
      nameArea: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(300),
        ],
      ],
    });
    try {
      const navigation = this.router.getCurrentNavigation();
      const objeto = navigation?.extras.state as {
        data: ConsultNotificationDto;
      };
      this.data = objeto.data;
      this.notificationsFormGroup.patchValue(this.data);
    } catch {}

    this.emailFormGroup = this._formBuilder.group({});
  }

  ngOnInit(): void {
    this.routeId = this.route.snapshot.params['id'];
    this.getAllNotificationType();

    this.notificacionesService.notificationId$.subscribe((id) => {
      if (id) {
        this.notificationId = id;
        this.notificationsFormGroup.get('id')?.setValue(this.notificationId);
      }
    });
  }

  getAllNotificationType() {
    this.spinner.show();
    this.notificacionesService.getAllNotificationTypes().subscribe({
      next: (result: NotificationTypeDto[]) => {
        this.notificationsTypes = result;
        this.spinner.hide();
      },
      error: (error) => {
        Alert.errorHttp(error);
        this.spinner.hide();
      },
    });
  }

  addNotification(redirectToAdvance: boolean, action: string = '') {
    if (this.savingNotify) {
      return;
    }

    this.spinner.show();
    const add: NotificationDto = {
      nameArea: this.notificationsFormGroup.get('nameArea')?.value,
      notificationTypeId:
        this.notificationsFormGroup.get('notificationTypeId')?.value,
      id: this.notificationsFormGroup.get('id')?.value,
    };

    this.savingNotify = true;
    this.notificacionesService.addNotification(add).subscribe({
      next: (result: ResponseDto) => {
        Alert.toastSWMessage('success', result.message);
        if (redirectToAdvance) {
          this.goBack();
        } else if (action === 'siguiente') {
          this.myStepper.next();
        }
        this.data = {
          nameArea: add.nameArea,
          notificationTypeId: add.notificationTypeId,
          id: result.result,
          notificationType: '',
          notificationEmails: [],
        };
        this.notificationsFormGroup.get('id')?.setValue(result.result);
        this.spinner.hide();
        this.savingNotify = false;
      },
      error: (error) => {
        Alert.errorHttp(error);
        this.savingNotify = false;
        this.spinner.hide();
        this.myStepper.selectedIndex = 0;
        return;
      },
    });
  }

  updateNotification(redirectToAdvance: boolean, action: string = '') {
    if (this.updateNotify) {
      return;
    }

    this.spinner.show();
    const update: NotificationDto = {
      nameArea: this.notificationsFormGroup.get('nameArea')?.value,
      notificationTypeId:
        this.notificationsFormGroup.get('notificationTypeId')?.value,
      id: this.notificationsFormGroup.get('id')?.value,
    };

    this.updateNotify = true;
    this.notificacionesService.updateNotification(update).subscribe({
      next: (result: ResponseDto) => {
        Alert.toastSWMessage('success', result.message);
        if (redirectToAdvance) {
          this.goBack();
        } else if (action === 'siguiente') {
          this.myStepper.next();
        }
        this.data.nameArea = update.nameArea;
        this.data.notificationTypeId = update.notificationTypeId;
        this.spinner.hide();
        this.updateNotify = false;
      },
      error: (error) => {
        Alert.errorHttp(error);
        this.updateNotify = false;
        this.spinner.hide();
        this.myStepper.selectedIndex = 0;
        return;
      },
    });
  }

  saveNotifications(redirectToAdvance: boolean, action: string = '') {
    this.notificationsFormGroup.markAllAsTouched();
    if (this.notificationsFormGroup.invalid) {
      return;
    }
    const id = this.notificationsFormGroup.get('id')?.value;
    if (id === 0) {
      this.addNotification(redirectToAdvance, action);
    } else {
      this.updateNotification(redirectToAdvance, action);
    }
  }

  onStepChange(event: any) {
    const selectedIndex = event.selectedIndex;
    if (selectedIndex === 1 && event.previouslySelectedIndex === 0) {
      this.saveNotifications(false);
    } else if (selectedIndex === 1 && event.previouslySelectedIndex !== 1) {
      this.notificacionesService.notifyNotification(selectedIndex);
    }
    this.previousStepIndex = selectedIndex;
  }

  goBack() {
    this.router.navigate(['catalogo/notificaciones']);
  }

  get notificationTypeId() {
    return this.notificationsFormGroup.get('notificationTypeId');
  }

  get nameArea() {
    return this.notificationsFormGroup.get('nameArea');
  }
}
