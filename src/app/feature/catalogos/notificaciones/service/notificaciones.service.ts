import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ResponseDto } from 'src/app/models/responseDto';
import { Email } from '../models/email';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  AddNotificationDto,
  AddNotificationEmailDto,
  ConsultNotificationDto,
  NotificationDto,
  NotificationEmailDto,
  NotificationTypeDto,
  SendNotificationDto,
} from '../models/notificaciones';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  private notificationIdSource = new Subject<number>();
  private stepChangeSubject = new Subject<number>();
 
  stepChange$ = this.stepChangeSubject.asObservable();
  notificationId$ = this.notificationIdSource.asObservable();
  provider: string;

  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getallNotifications(): Observable<ConsultNotificationDto[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ConsultNotificationDto[]>(
      `${ENDPOINT}/api/Notification/GetallNotifications`,
      options
    );
  }

  addNotification(notifications: AddNotificationDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/api/Notification/AddNotification`,
      notifications,
      options
    );
  }

  updateNotification(notifications: NotificationDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/api/Notification/UpdateNotification`,
      notifications,
      options
    );
  }

  getAllNotificationEmail(
    notificationId: number
  ): Observable<NotificationEmailDto[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<NotificationEmailDto[]>(
      `${ENDPOINT}/api/Notification/GetAllNotificationEmail?notificationId=${notificationId}`,
      options
    );
  }

  addNotificationEmail(
    notificationEmail: AddNotificationEmailDto
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/api/Notification/AddNotificationEmail`,
      notificationEmail,
      options
    );
  }

  updateNotificationEmail(
    notificationEmail: NotificationEmailDto
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/api/Notification/UpdateNotificationEmail`,
      notificationEmail,
      options
    );
  }

  deleteNotificationEmail(
    notificationEmailId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/api/Notification/DeleteNotificationEmail?notificationEmailId=${notificationEmailId}`,
      options
    );
  }

  getAllNotificationTypes(): Observable<NotificationTypeDto[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<NotificationTypeDto[]>(
      `${ENDPOINT}/api/Notification/GetAllNotificationTypes`,
      options
    );
  }

  sendNotification(send: SendNotificationDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/api/Notification/SendNotification`,
      send,
      options
    );
  }

  notifyNotification(step: number) {
    this.stepChangeSubject.next(step);
  }

  notifyNotificationId(id: number) {
    this.notificationIdSource.next(id);
  }

}
