import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubcargosService } from '../../service/subcargos.service';
import { Cargo } from '../../../cargos/models/cargo';
import { ActivatedRoute, Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { Subchanger } from '../../models/subcargos';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { CargoService } from '../../../cargos/service/cargo.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-form-subcargos',
  templateUrl: './form-subcargos.component.html',
  styleUrls: ['./form-subcargos.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class FormSubcargosComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') private myStepper: MatStepper;
  @ViewChild('mySelect') mySelect: MatSelect;
  subchargeFormGroup: FormGroup;
  elementFormGroup: FormGroup;
  positionList: Cargo[] = [];
  subChargue: Subchanger;
  titleButton: string;
  routeId: string;
  stepClose: boolean = false;
  isEditable = false;
  previousStepIndex: number = 0;
  savingSubcharge: boolean = false;
  updateSubcharge: boolean = false;
  subcargoSave: boolean = false;
  subchargerId: number;
  nameSubcharger: string
  namePosition: string
  nameCharge: string;


  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private subcargosService: SubcargosService,
    private cargoService: CargoService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
  ) {
    this.subchargeFormGroup = this._formBuilder.group({
      id: 0,
      name: ['', Validators.required],
      positionId: ['', Validators.required],
      position: [''],
      description: [''],
    });

    try {
      const navigation = this.router.getCurrentNavigation();
      let objeto = navigation?.extras.state as { data: Subchanger };
      this.subChargue = objeto.data;
      this.subchargeFormGroup.patchValue(this.subChargue);
      this.namePosition = this.subchargeFormGroup.get('position')?.value;
      this.subcargosService.setPosition(this.namePosition);
    } catch {
      console.warn('recarga sin ruta');
    }

    this.elementFormGroup = this._formBuilder.group({});

    this.route.paramMap.subscribe((params) => {
      const action = params.get('action');
      this.titleButton = action === 'editar' ? 'Editar' : 'Guardar';
    });
  }

  ngOnInit(): void {
    this.getCharge();
    this.routeId = this.route.snapshot.params['id'];

    this.subcargosService.subchargerId$.subscribe(id => {
      if (id) {
        this.subchargerId = id;
        this.subchargeFormGroup.get('id')?.setValue(this.subchargerId);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setFocus();
    }, 100);
    this.cd.detectChanges();
  }

  setFocus() {
    this.mySelect.focus();
  }

  onPositionSelectionChange(event: any) {
    const selectedPositionId = event.value;
    const selectedPosition = this.positionList.find(position => position.id === selectedPositionId);
    if (selectedPosition) {
      this.namePosition = selectedPosition.name;
    }
    this.subcargosService.setPosition(this.namePosition);
  }


  getCharge() {
    this.cargoService.getCargos().subscribe((res: Cargo[]) => {
      this.positionList = res;
    });
  }

  saveUpdateSubcharge(redirectToAdvance: boolean, action: string = '') {
    this.subchargeFormGroup.markAllAsTouched();
    if (this.subchargeFormGroup.invalid) {
      return;
    }
    if (!this.routeId) {
      this.insertSubChargue(redirectToAdvance, action);
    } else {
      this.updateSubChargue(redirectToAdvance, action);
    }
  }

  insertSubChargue(goToBack: boolean, action: string = '') {
    if (this.savingSubcharge) {
      return;
    }
    let add: Subchanger = {
      id: this.subchargeFormGroup.get('id')?.value,
      name: this.subchargeFormGroup.get('name')?.value,
      positionId: this.subchargeFormGroup.get('positionId')?.value,
      description: this.subchargeFormGroup.get('description')?.value,
    };
    this.spinner.show();
    this.nameSubcharger = this.subchargeFormGroup.get('name')?.value;
    this.subcargosService.setSubcharger(this.nameSubcharger);
    this.savingSubcharge = true;
    this.subcargosService.saveSubcharge(add).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          if (goToBack) {
            this.goBack();
          } else if (action === 'siguiente') {
            this.subcargoSave = true;
            this.myStepper.next();
          }
          this.subcargosService.notifysubchargerId(response.result.id);
        } else {
          Alert.toastSWMessage('warning', response.message);
        }
        this.spinner.hide();
        this.savingSubcharge = false;
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
        this.savingSubcharge = false;
        this.myStepper.selectedIndex = 0;
        return;
      },
    });
  }

  updateSubChargue(goToBack: boolean, action: string = '') {
    if (this.updateSubcharge) {
      return;
    }
    let update: Subchanger = {
      name: this.subchargeFormGroup.get('name')?.value,
      positionId: this.subchargeFormGroup.get('positionId')?.value,
      description: this.subchargeFormGroup.get('description')?.value,
      id: this.subChargue.id,
    };
    this.spinner.show();
    this.nameSubcharger = this.subchargeFormGroup.get('name')?.value;
    this.subcargosService.setSubcharger(this.nameSubcharger);
    this.updateSubcharge = true;
    this.subcargosService.updateSubcharge(update).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          if (goToBack) {
            this.goBack();
          } else if (action === 'siguiente') {
            this.subcargoSave = true;
            this.myStepper.next();
          }
        } else {
          Alert.toastSWMessage('warning', response.message);
        }
        this.spinner.hide();
        this.updateSubcharge = false;
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
        this.updateSubcharge = false;
        this.myStepper.selectedIndex = 0;
        return;
      },
    });
  }

  onStepChange(event: any) {
    const selectedIndex = event.selectedIndex;
    if (selectedIndex === 1 && event.previouslySelectedIndex === 0) {
      this.saveUpdateSubcharge(false);
    }
    else if (selectedIndex === 1 && event.previouslySelectedIndex !== 1) {
      this.subcargosService.notifySubCharge(selectedIndex);
    }
    this.previousStepIndex = selectedIndex;
  }


  goBack() {
    this.router.navigate(['catalogo/subcargos']);
  }

  get name() {
    return this.subchargeFormGroup.get('name');
  }

  get position() {
    return this.subchargeFormGroup.get('position');
  }

  get positionId() {
    return this.subchargeFormGroup.get('positionId');
  }
  get id() {
    return this.subchargeFormGroup.get('id');
  }
}
