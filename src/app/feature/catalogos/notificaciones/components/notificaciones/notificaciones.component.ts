import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { NotificacionesService } from '../../service/notificaciones.service';
import { ConsultNotificationDto } from '../../models/notificaciones';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
})
export class NotificacionesComponent implements OnInit {
  displayedColumns = ['notificationType', 'nameArea', 'acciones'];
  titleColumn = ['Tipo', 'Área', 'Acciones'];
  url = 'api/Notification/GetallNotifications';
  urlDelete = 'api/Notification/DeleteNotification';
  title = 'Notificaciones';
  changeUrl: boolean = false;

  isInsertOrEditrRoute: boolean = false;
  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRoute();
      });
  }

  private updateRoute(): void {
    this.isInsertOrEditrRoute = this.router.url.includes('editar');
    if (!this.isInsertOrEditrRoute) {
      this.isInsertOrEditrRoute = this.router.url.includes('crear');
    }
  }

  ngOnInit(): void {
    this.updateRoute();
    if (this.isInsertOrEditrRoute) {
      this.isInsertOrEditrRoute = false;
      this.router.navigateByUrl('catalogo/notificaciones');
    }
  }

  dataCreate() {
    this.router.navigateByUrl('catalogo/notificaciones/crear');
  }

  dataEdit(data: ConsultNotificationDto) {
    const dato: NavigationExtras = { state: { data: data } };
    this.router.navigate(
      ['catalogo/notificaciones/editar', { id: data.id }],
      dato
    );
  }
}
