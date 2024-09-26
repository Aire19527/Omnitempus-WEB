import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExtraHoursDto } from 'src/app/feature/catalogos/subcargos/models/elementsProvider';
import { TurnosService } from 'src/app/feature/catalogos/turnos/service/turnos.service';
import { PrincipalInfoSubChargesQuotationDto } from 'src/app/feature/cotizaciones/models/principalInfoSubChargesQuotationDto';
import { CotizacionesService } from 'src/app/feature/cotizaciones/service/cotizaciones.service';
import { RefrescarComponentesService } from 'src/app/feature/cotizaciones/service/refrescar-componentes.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';

@Component({
  selector: 'app-horas-extras',
  templateUrl: './horas-extras.component.html',
  styleUrls: ['./horas-extras.component.css'],
})
export class HorasExtrasComponent implements OnInit, AfterViewInit {
  @Input()
  principalInfoSubChargesQuotation: PrincipalInfoSubChargesQuotationDto;
  displayedColumns: string[] = ['concept', 'surcharge', 'numberHours', 'value'];
  dataSource: MatTableDataSource<ExtraHoursDto> =
    new MatTableDataSource<ExtraHoursDto>();
  test: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private spinner: NgxSpinnerService,
    private turnosService: TurnosService,
    private cotizacionesService: CotizacionesService,
    private refrescarComponentesService: RefrescarComponentesService
  ) {
    this.cotizacionesService.reloadExtraHour$.subscribe(() => {
      this.getAll();
    });

    this.refrescarComponentesService.refreschElement$.subscribe(() => {
      this.GetAllExtraHoursBySubChargesQuotation();
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    if (
      this.principalInfoSubChargesQuotation.subChargesQuotation?.extraHours
        ?.length
    ) {
      this.dataSource.data =
        this.principalInfoSubChargesQuotation.subChargesQuotation?.extraHours;
    }
  }

  getAll() {
    this.spinner.show();
    this.turnosService
      .getExtraHoursByShift(this.principalInfoSubChargesQuotation.id)
      .subscribe({
        next: (response: ResponseDto) => {
          if (response.result?.length) {
            this.dataSource.data = response.result as ExtraHoursDto[];
          }
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }

  GetAllExtraHoursBySubChargesQuotation() {
    this.spinner.show();
    this.turnosService
      .GetAllExtraHoursBySubChargesQuotation(
        this.principalInfoSubChargesQuotation.id
      )
      .subscribe({
        next: (response: ResponseDto) => {
          this.dataSource.data = response.result as ExtraHoursDto[];
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }
}
