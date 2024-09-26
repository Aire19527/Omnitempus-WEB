import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom } from 'rxjs';
import { Risk } from 'src/app/feature/catalogos/riesgos-arl/models/riesgos';
import { RiesgosArlService } from 'src/app/feature/catalogos/riesgos-arl/service/riesgos-arl.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { EditarARLComponent } from './editar-arl/editar-arl.component';
import { RiskARLQuotationDto } from 'src/app/feature/catalogos/subcargos/models/elementsProvider';
import { RiskARLEstimateService } from 'src/app/feature/cotizaciones/service/risk-arlestimate.service';
import { PrincipalInfoSubChargesQuotationDto } from 'src/app/feature/cotizaciones/models/principalInfoSubChargesQuotationDto';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CotizacionesService } from 'src/app/feature/cotizaciones/service/cotizaciones.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RefrescarComponentesService } from 'src/app/feature/cotizaciones/service/refrescar-componentes.service';

@Component({
  selector: 'app-prestaciones-sociales-legales',
  templateUrl: './prestaciones-sociales-legales.component.html',
  styleUrls: ['./prestaciones-sociales-legales.component.css'],
})
export class PrestacionesSocialesLegalesComponent
  implements OnInit, AfterViewInit
{
  displayedColumns: string[] = ['concept', 'percentage', 'value', 'acciones'];
  dataSource: MatTableDataSource<RiskARLQuotationDto> =
    new MatTableDataSource<RiskARLQuotationDto>();
  @Input()
  principalInfoSubChargesQuotation: PrincipalInfoSubChargesQuotationDto;
  risks: Risk[] = [];
  statusName: string;
  isStatusDisabled: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private riesgosArlService: RiesgosArlService,
    private riskARLEstimateService: RiskARLEstimateService,
    private matDialog: MatDialog,
    private spinner: NgxSpinnerService,
    private cotizacionesService: CotizacionesService,
    private refrescarComponentesService: RefrescarComponentesService
  ) {
    this.refrescarComponentesService.refreschElement$.subscribe(() => {
      this.getAll();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    if (
      this.principalInfoSubChargesQuotation.subChargesQuotation
        ?.riskARLQuotations
    ) {
      this.dataSource.data = this.orderList(
        this.principalInfoSubChargesQuotation.subChargesQuotation
          .riskARLQuotations
      );
    }
    this.statusName = this.cotizacionesService.getStatusName();
    this.updateStatusDisabled();
  }

  updateStatusDisabled() {
    if (
      this.statusName === 'Enviada al Solicitante' ||
      this.statusName === 'Enviada al Cliente' ||
      this.statusName === 'Aprobada' ||
      this.statusName === 'Reemplazada' ||
      this.statusName === 'No Aprobada' ||
      this.statusName === 'Anulada'
    ) {
      this.isStatusDisabled = true;
    } else {
      this.isStatusDisabled = false;
    }
  }

  getAll() {
    this.spinner.show();
    this.riskARLEstimateService
      .getAll(this.principalInfoSubChargesQuotation.id)
      .subscribe({
        next: (response: RiskARLQuotationDto[]) => {
          this.dataSource.data = this.orderList(response);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }

  orderList(subChargesList: RiskARLQuotationDto[]) {
    const orderedConcepts = [
      'Cesantías',
      'Intereses a las cesantías',
      'Prima legal',
      'Vacaciones',
      'Caja de compensación',
      'ICBF',
      'SENA',
      'Parafiscales sobre vacaciones',
      'Seguridad social sobre vacaciones',
      'IVM (Pensión)',
      'Salud',
      'ARL',
    ];

    subChargesList.sort((a, b) => {
      return (
        orderedConcepts.indexOf(a.concept) - orderedConcepts.indexOf(b.concept)
      );
    });

    return subChargesList;
  }
  edit(parameter: RiskARLQuotationDto) {
    this.openDialog(parameter);
  }

  async openDialog(data: RiskARLQuotationDto) {
    if (this.risks.length > 0) {
      this.dialogResult(data);
    } else {
      try {
        this.risks = await lastValueFrom(this.riesgosArlService.getRisk());
      } catch (error) {
        console.error(error);
        Alert.error(
          'Ha ocurrido un error interno, por favor volverlo a intentar.'
        );
      }

      if (this.risks.length > 0) {
        this.dialogResult(data);
      } else {
        Alert.warning(
          'Por favor registrar primero los riesgos ARL para continuar con la edición de prestaciones sociales.'
        );
      }
    }
  }

  dialogResult(data: RiskARLQuotationDto) {
    const dialogRef = this.matDialog.open(EditarARLComponent, {
      width: '40%',
      data: { risks: this.risks, risk: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAll();
      }
    });
  }
}
