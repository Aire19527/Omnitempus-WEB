export interface AddNotificationDto {
  notificationTypeId: number;
  nameArea: string;
}
export interface NotificationDto extends AddNotificationDto {
  id: number;
}

export interface ConsultNotificationDto extends NotificationDto {
  notificationType: string;
  notificationEmails: NotificationEmailDto[];
}

export interface NotificationEmailDto extends AddNotificationEmailDto {
  notificationEmailId: number;
}
export interface AddNotificationEmailDto {
  notificationId: number;
  email: string;
}

export interface NotificationTypeDto {
  notificationTypeId: number;
  notificationType: string;
}

export interface SendNotificationDto {
  notificationIds: number[];
  idQuotation: number;
}
