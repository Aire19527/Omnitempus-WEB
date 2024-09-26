import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsultPosition } from 'src/app/feature/catalogos/cargos/models/cargo';
import { CargoService } from 'src/app/feature/catalogos/cargos/service/cargo.service';
import {
  AddElementQuotationDto,
  Subchanger,
} from 'src/app/feature/catalogos/subcargos/models/subcargos';
import { SubcargosService } from 'src/app/feature/catalogos/subcargos/service/subcargos.service';
import { Alert } from 'src/app/helpers/alert_helper';
import {
  DepartamentModel,
  MunicipalityModel,
} from 'src/app/shared/models/departament-model';
import { DepartamentMunicipalityService } from 'src/app/shared/services/departament_city.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseDto } from 'src/app/models/responseDto';
import { SubChargesQuotationDto } from 'src/app/feature/catalogos/subcargos/models/elementsProvider';
import { CotizacionesService } from '../../service/cotizaciones.service';
import { PrincipalInfoSubChargesQuotationDto } from '../../models/principalInfoSubChargesQuotationDto';
import { StateChangeService } from '../../service/state-change.service';
import { SteppersService } from '../../service/steppers.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.css'],
})
export class PuestosComponent implements OnInit {
  puestosFormGroup: FormGroup;
  stateChangeForm: FormGroup;
  departaments: DepartamentModel[] = [];
  municipalities: MunicipalityModel[] = [];
  cargos: ConsultPosition[] = [];
  position: ConsultPosition;
  subCargos: Subchanger[] = [];
  quotationId: number;
  principalInfoSubChargesQuotations: PrincipalInfoSubChargesQuotationDto[];
  statusName: string;
  isStatusDisabled: boolean = false;
  private stepperSubscription: Subscription;
  constructor(
    private _formBuilder: FormBuilder,
    private ctrlStepper: FormGroupDirective,
    private departamentMunicipalityService: DepartamentMunicipalityService,
    private cargoService: CargoService,
    private subcargosService: SubcargosService,
    private cotizacionesService: CotizacionesService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private stateChangeService: StateChangeService,
    private steppersService: SteppersService
  ) {
    this.puestosFormGroup = this._formBuilder.group({
      cargo: [''],
      subCargo: [''],
      departmentCode: [''],
      municipalityCode: [''],
      count: ['', [Validators.min(1)]],
    });

    this.stateChangeForm = this._formBuilder.group({
      quotationId: [null, [Validators.required]],
      newStatusId: [null, [Validators.required]],
      lastStatusId: [null, [Validators.required]],
      observations: ['', [Validators.required]],
    });

    this.quotationId = this.route.snapshot.params['id'];

    this.cotizacionesService.quotationId$.subscribe((id) => {
      if (id) {
        this.quotationId = id;
        this.stateChangeForm.get('id')?.setValue(this.quotationId);
      }
    });

    this.stepperSubscription = this.steppersService
      .onStepperClicked()
      .subscribe((step) => {
        if (step === 1) {
          this.getAllSubChargesQuotation();
        }
      });
  }

  async ngOnInit() {
    if (this.quotationId) {
      await this.getAllSubChargesQuotation();
    }

    this.getAllCargos();
    this.getAllDepartament();
    this.statusName = this.cotizacionesService.getStatusName();
    this.cotizacionesService.statusName$.subscribe((statusName) => {
      this.statusName = statusName;
    });
    this.updateStatusDisabled();

    this.ctrlStepper.form &&
      this.ctrlStepper.form.addControl('puestos-form', this.puestosFormGroup);
  }

  ngOnDestroy() {
    this.stepperSubscription.unsubscribe();
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
      this.puestosFormGroup.get('count')?.disable();
    } else {
      this.isStatusDisabled = false;
    }
  }

  getAllCargos() {
    this.spinner.show();
    this.cargoService.getCargos().subscribe({
      next: (response: ConsultPosition[]) => {
        this.cargos = response;
        if (this.cargos.length == 0) {
          Alert.toastSWMessage(
            'warning',
            'No hay cargos registrados, por favor registrarlos primero.'
          );
        }
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        console.error(error);
        Alert.error(
          'Ha ocurrido un error al cosultar los cargos, por favor vuelva a intentarlo.'
        );
      },
    });
  }

  selectCargo() {
    const idCargo = this.puestosFormGroup.get('cargo')?.value;
    this.position = this.cargos.find((x) => x.id == idCargo)!;
    this.getAllSubCargos(idCargo);
  }

  getAllSubCargos(idCargo: number) {
    this.spinner.show();
    this.subcargosService.getSubChargesByPosition(idCargo).subscribe({
      next: (response: Subchanger[]) => {
        this.subCargos = response;
        if (this.subCargos.length == 0) {
          Alert.toastSWMessage(
            'warning',
            'No hay subcargos registrados, para el cargo seleccionado.'
          );
        }
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        console.error(error);
        Alert.error(
          'Ha ocurrido un error al cosultar los municipios, por favor vuelva a intentarlo.'
        );
      },
    });
  }

  getAllDepartament() {
    this.spinner.show();
    this.departamentMunicipalityService.getAllDepartaments().subscribe({
      next: (response: DepartamentModel[]) => {
        this.departaments = response;
        if (this.departaments.length == 0) {
          Alert.toastSWMessage(
            'warning',
            'No hay departamentos registrados, por favor registrarlos primero.'
          );
        }
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        console.error(error);
        Alert.error(
          'Ha ocurrido un error al cosultar los departamentos, por favor vuelva a intentarlo.'
        );
      },
    });
  }

  selectDepartament() {
    const code = this.puestosFormGroup.get('departmentCode')?.value;
    this.getAllMunicipalies(code);
  }

  getAllMunicipalies(code: string) {
    this.spinner.show();
    this.departamentMunicipalityService
      .getAllMunicipalitiesByDepartament(code)
      .subscribe({
        next: (response: MunicipalityModel[]) => {
          this.municipalities = response;
          if (this.municipalities.length == 0) {
            Alert.toastSWMessage(
              'warning',
              'No hay municipios registrados, para el departamento seleccionado.'
            );
          }
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error(error);
          Alert.error(
            'Ha ocurrido un error al cosultar los municipios, por favor vuelva a intentarlo.'
          );
        },
      });
  }

  async getAllSubChargesQuotation() {
    try {
      this.spinner.show();
      const response: ResponseDto = await this.getAllSubChargesByQuotation();
      this.principalInfoSubChargesQuotations =
        response.result as PrincipalInfoSubChargesQuotationDto[];
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
      Alert.errorHttp(error);
    }
  }

  getAllSubChargesByQuotation(): Promise<ResponseDto> {
    return new Promise((resolve, reject) => {
      this.cotizacionesService
        .getAllSubChargesQuotationByQuotation(this.quotationId)
        .subscribe({
          next: (response: ResponseDto) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  validarCamposRequeridos(): boolean {
    let result = true;
    if (
      this.puestosFormGroup.get('cargo')?.value == '' ||
      this.puestosFormGroup.get('subCargo')?.value == '' ||
      this.puestosFormGroup.get('departmentCode')?.value == '' ||
      this.puestosFormGroup.get('municipalityCode')?.value == '' ||
      this.puestosFormGroup.get('count')?.value == ''
    ) {
      result = false;
    }

    const count = this.puestosFormGroup.get('count')?.value;
    if (count != '' && count < 1) {
      result = false;
    }

    return result;
  }

  addPuesto() {
    if (this.validarCamposRequeridos()) {
      const principalPosition: PrincipalInfoSubChargesQuotationDto = {
        idPosition: this.puestosFormGroup.get('cargo')?.value,
        idSubChargue: this.puestosFormGroup.get('subCargo')?.value,
        idDepartament: this.puestosFormGroup.get('departmentCode')?.value,
        idMunicipality: this.puestosFormGroup.get('municipalityCode')?.value,
        quotationId: this.quotationId,
        id: 0,
        subchargeFormat: '',
        count: this.puestosFormGroup.get('count')?.value,
      };
      let result;

      if (this.principalInfoSubChargesQuotations) {
        result = this.principalInfoSubChargesQuotations.find(
          (x) =>
            x.idMunicipality == principalPosition.idMunicipality &&
            x.idDepartament == principalPosition.idDepartament &&
            x.idPosition == principalPosition.idPosition &&
            x.idSubChargue == principalPosition.idSubChargue
        );
      } else {
        this.principalInfoSubChargesQuotations = [];
      }

      // if (result) {
      //   Alert.warning(
      //     'Ya ha agregado un cargo para el mismo subcargo, en el mismo departamento y municipio.'
      //   );
      // } else {
      //   const city = this.municipalities.find(
      //     (x) => x.code == principalPosition.idMunicipality
      //   )?.name!;
      //   const departament = this.departaments.find(
      //     (x) => x.code == principalPosition.idDepartament
      //   )?.name!;
      //   const positionName = this.cargos.find(
      //     (x) => x.id == principalPosition.idPosition
      //   )?.name!;
      //   const subChargueName = this.subCargos.find(
      //     (x) => x.id == principalPosition.idSubChargue
      //   )?.name!;
      //   principalPosition.subchargeFormat = `${positionName} - ${subChargueName} / ${city} - ${departament} / Cantidad: ${principalPosition.count}`;

      //   this.savePositionService(principalPosition);
      // }

      const city = this.municipalities.find(
        (x) => x.code == principalPosition.idMunicipality
      )?.name!;
      const departament = this.departaments.find(
        (x) => x.code == principalPosition.idDepartament
      )?.name!;
      const positionName = this.cargos.find(
        (x) => x.id == principalPosition.idPosition
      )?.name!;
      const subChargueName = this.subCargos.find(
        (x) => x.id == principalPosition.idSubChargue
      )?.name!;
      principalPosition.subchargeFormat = `${positionName} - ${subChargueName} / ${city} - ${departament} / Cantidad: ${principalPosition.count}`;

      this.savePositionService(principalPosition);
    }
  }

  savePositionService(position: PrincipalInfoSubChargesQuotationDto) {
    if (!this.quotationId) {
      this.quotationId = this.cotizacionesService.getQuotationId();
    }

    if (this.quotationId) {
      this.spinner.show();

      const add: AddElementQuotationDto = {
        quotationId: this.quotationId,
        subchargeId: position.idSubChargue,
        municipalityCode: position.idMunicipality,
        count: position.count,
      };
      this.subcargosService.addSubChargesByPositionQuotation(add).subscribe({
        next: (response: ResponseDto) => {
          const subQuotation = response.result as SubChargesQuotationDto;
          position.subChargesQuotation = subQuotation;
          position.id = subQuotation.idSubChargesQuotation;
          this.principalInfoSubChargesQuotations.push(position);
          this.spinner.hide();
          this.puestosFormGroup.get('cargo')?.reset('');
          this.puestosFormGroup.get('subCargo')?.reset('');
          this.puestosFormGroup.get('departmentCode')?.reset('');
          this.puestosFormGroup.get('municipalityCode')?.reset('');
          this.puestosFormGroup.get('count')?.reset(null, { emitEvent: false });
          this.puestosFormGroup.get('count')?.markAsUntouched();
          this.puestosFormGroup.get('count')?.markAsPristine();
        },
        error: (error) => {
          this.spinner.hide();
          console.error(error);
          Alert.errorHttp(error);
        },
      });
    } else {
      Alert.warning('Debe agregar la cotización para poder continuar');
    }
  }

  goOut() {
    this.router.navigate(['/cotizaciones']);
  }

  siguiente() {
    this.addPuesto();
  }

  saveStateChange() {
    if (this.quotationId) {
      this.stateChangeForm.patchValue({
        quotationId: this.quotationId,
        lastStatusId: 0,
        newStatusId: 2,
      });
      this.stateChangeService
        .saveStateChange(this.stateChangeForm.value)
        .subscribe({
          next: (response: ResponseDto) => {
            if (response.isSuccess) {
              Alert.toastSWMessage('success', response.message);
              this.statusName = 'Solicitada';
              this.cotizacionesService.changeStatus(2);
              this.cotizacionesService.setStatusName(this.statusName);
              this.cotizacionesService.setStatusId(2);
            } else {
              Alert.toastSWMessage('warning', response.message);
            }
            this.spinner.hide();
          },
          error: (error) => {
            this.spinner.hide();
            Alert.errorHttp(error);
          },
        });
    }
  }

  elimimnarPuesto(id: number) {
    this.principalInfoSubChargesQuotations =
      this.principalInfoSubChargesQuotations.filter((x) => x.id != id);
  }

  goBack() {
    this.router.navigate(['/cotizaciones']);
  }
}
