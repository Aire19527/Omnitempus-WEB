import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubcargosService } from 'src/app/feature/catalogos/subcargos/service/subcargos.service';
import {
  CalcularCostosDto,
  ImpuestosMargenesDto,
} from 'src/app/feature/cotizaciones/models/costos-cotizacion';
import { PrincipalInfoSubChargesQuotationDto } from 'src/app/feature/cotizaciones/models/principalInfoSubChargesQuotationDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';
import { HelperService } from 'src/app/shared/services/helper.service';
import { MONEDA, PORCENTAJE } from 'src/app/helpers/constants';
import { RefrescarComponentesService } from 'src/app/feature/cotizaciones/service/refrescar-componentes.service';
import { CotizacionesService } from 'src/app/feature/cotizaciones/service/cotizaciones.service';
@Component({
  selector: 'app-calcular-costos',
  templateUrl: './calcular-costos.component.html',
  styleUrls: ['./calcular-costos.component.css'],
})
export class CalcularCostosComponent {
  @Output() costsCalculated: EventEmitter<void> = new EventEmitter<void>();
  @Input()
  principalInfoSubChargesQuotation: PrincipalInfoSubChargesQuotationDto;

  displayedColumns: string[] = ['taxName', 'cost', 'percentage'];
  dataSourceTaxesMargin: MatTableDataSource<ImpuestosMargenesDto> =
    new MatTableDataSource<ImpuestosMargenesDto>();

  costos: CalcularCostosDto;
  statusName: string;
  isStatusDisabled: boolean = false;
  constructor(
    private subcargosService: SubcargosService,
    private spinner: NgxSpinnerService,
    private refrescarComponentesService: RefrescarComponentesService,
    private cotizacionesService: CotizacionesService,
  ) {}

  ngOnInit(): void {
    this.costos = new CalcularCostosDto();

    if (
      this.principalInfoSubChargesQuotation.subChargesQuotation?.costsCalculated
    ) {
      this.reloadData(
        this.principalInfoSubChargesQuotation.subChargesQuotation
          ?.costsCalculated
      );
    }

    this.statusName = this.cotizacionesService.getStatusName();
    this.cotizacionesService.statusName$.subscribe(statusName => {
      this.statusName = statusName;
    });
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

  reloadData(data: CalcularCostosDto) {
    this.costos = data;
    this.dataSourceTaxesMargin.data = this.costos.taxesMarginDto;
  }

  calculateQuotationValues() {
    this.spinner.show();
    this.subcargosService
      .calculateQuotationValues(
        this.principalInfoSubChargesQuotation.quotationId,
        this.principalInfoSubChargesQuotation.idSubChargue,
        this.principalInfoSubChargesQuotation.idMunicipality
      )
      .subscribe({
        next: (response: ResponseDto) => {
          const result = response.result as CalcularCostosDto;
          this.reloadData(result);
          this.spinner.hide();
          // this.costsCalculated.emit();
          this.refrescarComponentesService.refreschElement();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }
}
