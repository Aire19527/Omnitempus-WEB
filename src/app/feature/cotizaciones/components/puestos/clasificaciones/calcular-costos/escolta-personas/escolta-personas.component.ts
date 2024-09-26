import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParametroGenService } from 'src/app/feature/catalogos/parametros-gen/service/parametro-gen.service';
import { SubcargosService } from 'src/app/feature/catalogos/subcargos/service/subcargos.service';
import {
  CalcularCostosDto,
  ImpuestosMargenesDto,
  TarifaServiciosDto,
} from 'src/app/feature/cotizaciones/models/costos-cotizacion';
import { PrincipalInfoSubChargesQuotationDto } from 'src/app/feature/cotizaciones/models/principalInfoSubChargesQuotationDto';
import { CotizacionesService } from 'src/app/feature/cotizaciones/service/cotizaciones.service';
import { RefrescarComponentesService } from 'src/app/feature/cotizaciones/service/refrescar-componentes.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';

@Component({
  selector: 'app-escolta-personas',
  templateUrl: './escolta-personas.component.html',
  styleUrls: ['./escolta-personas.component.css'],
})
export class EscoltaPersonasComponent implements OnInit, OnChanges {
  @Input()
  principalInfoSubChargesQuotation: PrincipalInfoSubChargesQuotationDto;
  @Input() costos: CalcularCostosDto;
  @Output() costosRecalculados: EventEmitter<CalcularCostosDto> =
    new EventEmitter();
  tarifaServicios: TarifaServiciosDto[];
  tarifaMinimaSVFormGroup: FormGroup;
  recalcularSVFormGroup: FormGroup;
  calcularIVASVFormGroup: FormGroup;
  valueMinimumTariff: number;
  serviceTariff: number;
  statusName: string;
  isStatusDisabled: boolean = false;
  // servicioIVA: CalcularCostosDto;

  constructor(
    private parametroGenService: ParametroGenService,
    private subcargosService: SubcargosService,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    private refrescarComponentesService: RefrescarComponentesService,
    private cotizacionesService: CotizacionesService
  ) {
    this.tarifaMinimaSVFormGroup = this._formBuilder.group({
      servicioTarifaId: ['', [Validators.required]],
      tarifaPorcentaje: [''],
      aplicaTarifaMinimaSV: ['', [Validators.required]],
    });
    this.tarifaMinimaSVFormGroup.patchValue({ aplicaTarifaMinimaSV: false });

    this.recalcularSVFormGroup = this._formBuilder.group({
      valorObjetivo: ['', [Validators.required]],
      aplicaValorObjetivo: ['', [Validators.required]],
      sobreTarifaMensualServicioAIU: ['', [Validators.required]],
    });
    this.recalcularSVFormGroup.patchValue({ aplicaValorObjetivo: false });

    this.calcularIVASVFormGroup = this._formBuilder.group({
      tipoIVA: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.costos = new CalcularCostosDto();

    if (
      this.principalInfoSubChargesQuotation.subChargesQuotation?.costsCalculated
    ) {
      this.reloadData(
        this.principalInfoSubChargesQuotation.subChargesQuotation
          ?.costsCalculated
      );
    } else {
      this.getServiceTariffParameters();
    }

    this.statusName = this.cotizacionesService.getStatusName();
    this.cotizacionesService.statusName$.subscribe((statusName) => {
      this.statusName = statusName;
    });
    this.updateStatusDisabled();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Verificamos si la propiedad 'costos' ha cambiado
    if (changes['costos']) {
      const valorAnterior = changes['costos'].previousValue;
      const valorActual = changes['costos'].currentValue;

      // Llamamos la función con el nuevo valor
      this.reloadData(valorActual);
    }
  }

  updateStatusDisabled() {
    const statusName = this.statusName;
    const disabledStatuses = [
      'Enviada al Solicitante',
      'Enviada al Cliente',
      'Aprobada',
      'Reemplazada',
      'No Aprobada',
      'Anulada',
    ];
    this.isStatusDisabled = disabledStatuses.includes(statusName);
    this.disableFieldsBystatus(this.isStatusDisabled);
  }

  disableFieldsBystatus(disabled: boolean) {
    const controlsToDisable = [
      'tipoIVA',
      'aplicaTarifaMinimaSV',
      'servicioTarifaId',
      'aplicaValorObjetivo',
      'sobreTarifaMensualServicioAIU',
      'valorObjetivo',
    ];

    controlsToDisable.forEach((controlName) => {
      const control =
        this.calcularIVASVFormGroup.get(controlName) ||
        this.tarifaMinimaSVFormGroup.get(controlName) ||
        this.recalcularSVFormGroup.get(controlName);
      if (control) {
        disabled
          ? control.disable({ emitEvent: false })
          : control.enable({ emitEvent: false });
      }
    });
  }

  reloadData(data: CalcularCostosDto) {
    this.costos = data;
    this.recalcularSVFormGroup
      .get('valorObjetivo')
      ?.setValue(data.objectiveValue);
    this.recalcularSVFormGroup
      .get('aplicaValorObjetivo')
      ?.setValue(data.applyObjectiveValue);
    this.recalcularSVFormGroup
      .get('sobreTarifaMensualServicioAIU')
      ?.setValue(data.monthlyTariff);
    this.tarifaMinimaSVFormGroup
      .get('aplicaTarifaMinimaSV')
      ?.setValue(data.applyMinimumTariff);
    this.tarifaMinimaSVFormGroup
      .get('servicioTarifaId')
      ?.setValue(data.serviceTariff);
    this.calcularIVASVFormGroup.get('tipoIVA')?.setValue(data.typeIVA);
    this.valueMinimumTariff = data.minimumTariffSV ?? 0;
    this.getServiceTariffParameters(data.serviceTariff);
  }

  getServiceTariffParameters(serviceTariffID?: number) {
    this.spinner.show();
    this.parametroGenService.getServiceTariffParameters().subscribe({
      next: (response: TarifaServiciosDto[]) => {
        this.tarifaServicios = response;
        this.onSelectTariff(serviceTariffID);
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
      },
    });
  }

  onSelectTariff(tariffId: number | undefined) {
    if (tariffId !== undefined) {
      const selectedTariff = this.tarifaServicios.find(
        (tarifa) => tarifa.id === tariffId
      );

      if (selectedTariff) {
        this.tarifaMinimaSVFormGroup
          .get('servicioTarifaId')
          ?.setValue(selectedTariff.id);
        this.tarifaMinimaSVFormGroup
          .get('tarifaPorcentaje')
          ?.setValue(selectedTariff.percentage);
      }
    }
  }

  calculateMonthlyTariff() {
    if (!this.costos.totalCosts || this.costos.totalCosts == 0) {
      Alert.warning('Primero debe calcular costos');
    } else {
      this.spinner.show();
      this.subcargosService
        .calculateMonthlyTariff(this.costos?.totalCosts ?? 0)
        .subscribe({
          next: (response: ResponseDto) => {
            this.costos.costMonthlyService = response.result;
            this.spinner.hide();
          },
          error: (error) => {
            this.spinner.hide();
            Alert.errorHttp(error);
          },
        });
    }
  }

  minimumTariff() {
    if (
      !this.costos.costMonthlyService ||
      this.costos.costMonthlyService == 0
    ) {
      Alert.warning('Primero debe calcular la tarifa mensual del servicio');
    } else {
      const serviceTariffPercentage =
        this.tarifaMinimaSVFormGroup.get('tarifaPorcentaje')?.value;
      const serviceTariffId =
        this.tarifaMinimaSVFormGroup.get('servicioTarifaId')?.value;
      this.spinner.show();
      this.subcargosService
        .minimumTariff(
          this.principalInfoSubChargesQuotation.id,
          serviceTariffPercentage,
          this.costos.costMonthlyService,
          serviceTariffId
        )
        .subscribe({
          next: (response: ResponseDto) => {
            this.valueMinimumTariff = response.result.minimumTariff;
            this.spinner.hide();
          },
          error: (error) => {
            this.spinner.hide();
            Alert.errorHttp(error);
          },
        });
    }
  }

  calculateObjectiveValue() {
    if (!this.costos.totalCosts || this.costos.totalCosts == 0) {
      Alert.warning('Primero debe calcular costos');
    } else {
      const valorObjetivo =
        this.recalcularSVFormGroup.get('valorObjetivo')?.value;
      const monthlyTariff = this.recalcularSVFormGroup.get(
        'sobreTarifaMensualServicioAIU'
      )?.value;
      this.spinner.show();
      this.subcargosService
        .calculateObjectiveValue(
          this.principalInfoSubChargesQuotation.id,
          valorObjetivo,
          monthlyTariff,
          this.costos.totalCosts
        )
        .subscribe({
          next: (response: ResponseDto) => {
            const resultado = response.result as CalcularCostosDto;
            this.costosRecalculados.emit(resultado);
            this.refrescarComponentesService.refreschElement();
            this.spinner.hide();
          },
          error: (error) => {
            this.spinner.hide();
            Alert.errorHttp(error);
          },
        });
    }
  }

  selectedTarifaServicioMensual() {
    if (
      this.recalcularSVFormGroup.get('aplicaValorObjetivo')?.value &&
      this.recalcularSVFormGroup.get('sobreTarifaMensualServicioAIU')?.value ==
        '0'
    ) {
      this.recalcularSVFormGroup
        .get('valorObjetivo')
        ?.setValue(this.costos.costMonthlyService);
    } else {
      this.recalcularSVFormGroup.get('valorObjetivo')?.setValue('');
    }
  }

  calculateServiceWithIVA() {
    if (
      !this.costos.costMonthlyService ||
      this.costos.costMonthlyService == 0
    ) {
      Alert.warning('Primero debe calcular la tarifa mensual del servicio');
    } else {
      const tipoIVA = this.calcularIVASVFormGroup.get('tipoIVA')?.value;
      this.spinner.show();
      this.subcargosService
        .calculateServiceWithIVA(
          this.principalInfoSubChargesQuotation.id,
          tipoIVA,
          this.costos.costMonthlyService
        )
        .subscribe({
          next: (response: ResponseDto) => {
            const test = response.result as CalcularCostosDto;
            this.costos.ivaPercentage = test.ivaPercentage;
            this.costos.ivaCosts = test.ivaCosts;
            this.costos.serviceWithIVA = test.serviceWithIVA;
            this.refrescarComponentesService.refreschElement();
            this.spinner.hide();
          },
          error: (error) => {
            this.spinner.hide();
            Alert.errorHttp(error);
          },
        });
    }
  }
}
