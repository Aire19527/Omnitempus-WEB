import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { filter, lastValueFrom } from 'rxjs';
import { Cotizaciones, QuotationGetDto } from '../../models/cotizaciones';
import { CotizacionesService } from '../../service/cotizaciones.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Alert } from 'src/app/helpers/alert_helper';
import { dA, er } from '@fullcalendar/core/internal-common';
import { MatDialog } from '@angular/material/dialog';
import { NotificacionComponent } from '../notificacion/notificacion.component';
import { NotificacionesService } from 'src/app/feature/catalogos/notificaciones/service/notificaciones.service';
import { ConsultNotificationDto } from 'src/app/feature/catalogos/notificaciones/models/notificaciones';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css'],
})
export class CotizacionesComponent implements OnInit {
  isInsertOrEditrRoute: boolean = false;
  displayedColumns = [
    'requestNumber',
    'offerCode',
    'customersName',
    'bussinesLineName',
    'statusName',
    'acciones',
  ];
  dataSource: MatTableDataSource<QuotationGetDto> =
    new MatTableDataSource<QuotationGetDto>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  listaNotificacion: ConsultNotificationDto[] = [];
  constructor(
    private router: Router,
    private cotizacionesService: CotizacionesService,
    private spinner: NgxSpinnerService,
    private matDialog: MatDialog,
    private notificacionesService: NotificacionesService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRoute();
      });
  }

  ngOnInit(): void {
    this.getQuotation();
    this.updateRoute();
    if (this.isInsertOrEditrRoute) {
      this.isInsertOrEditrRoute = false;
      this.router.navigateByUrl('cotizaciones');
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (
          !this.router.url.includes('editar') &&
          !this.router.url.includes('crear')
        ) {
          this.getQuotation();
        }
      }
    });
  }

  private updateRoute(): void {
    this.isInsertOrEditrRoute = this.router.url.includes('editar');
    if (!this.isInsertOrEditrRoute) {
      this.isInsertOrEditrRoute = this.router.url.includes('crear');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getQuotation() {
    this.spinner.show();
    this.cotizacionesService.getQuotation().subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        console.error(error);
        Alert.errorHttp(error);
      },
    });
  }

  dataCreate(): void {
    this.router.navigateByUrl('cotizaciones/crear');
  }

  dataEdit(data: QuotationGetDto) {
    //const dato: NavigationExtras = { state: { data: data } };
    //this.router.navigate(['cotizaciones/editar', { id: data.id }], dato);
    this.router.navigate([
      'cotizaciones/editar',
      { action: 'editar', id: data.id },
    ]);
    this.cotizacionesService.setStatusName(data.statusName);
    this.cotizacionesService.setStatusId(data.statusId);
    this.cotizacionesService.setQuotationId(data.id);
    this.cotizacionesService.setEditMode(true);
    this.cotizacionesService.setNamRequest(data.requestNumber);
    this.cotizacionesService.setNamOffert(data.offerCode);
  }

  showDeleteButtonForQuotation(statusName: string): boolean {
    const opcionAccionStatusNames = [
      'Reemplazada',
      'Anulada',
      'Enviada al Cliente',
      'Enviada al Solicitante',
      'No Aprobada',
      'Aprobada',
      'Generada',
    ];
    return !opcionAccionStatusNames.includes(statusName);
  }

  deleteData(data: QuotationGetDto) {
    Alert.questionConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.cotizacionesService.deleteQuotation(data.id).subscribe({
          next: (result) => {
            this.spinner.hide();
            Alert.toastSWMessage('success', result.message);
            this.getQuotation();
          },
          error: (error) => {
            this.spinner.hide();
            console.error(error);
            Alert.errorHttp(error);
          },
        });
      }
    });
  }

  showNotificacionQuotation(statusName: string): boolean {
    const opcionAccionStatusNames = ['Aprobada'];
    return opcionAccionStatusNames.includes(statusName);

    //return true;
  }

  notificationData(data: QuotationGetDto) {
    this.openDialog(data.id);
  }

  async openDialog(idQuotation: number) {
    if (this.listaNotificacion.length > 0) {
      this.dialogResult(idQuotation);
    } else {
      try {
        this.spinner.show();
        const response = await lastValueFrom(
          this.notificacionesService.getallNotifications()
        );
        this.listaNotificacion = response;

        this.spinner.hide();
      } catch (error) {
        this.spinner.hide();
        console.error(error);
        Alert.errorHttp(error);
      }

      if (this.listaNotificacion.length > 0) {
        this.dialogResult(idQuotation);
      } else {
        Alert.warning(
          'No hay notificaciones en el Catálogo, por favor crearlas primero.'
        );
      }
    }
  }

  dialogResult(idQuotation: number) {
    this.matDialog
      .open(NotificacionComponent, {
        width: '60%',
        data: {
          IdQuotation: idQuotation,
          Notificaciones: this.listaNotificacion,
        },
      })
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (value) {
            console.log('cerrado');
          }
        },
      });
  }
}
