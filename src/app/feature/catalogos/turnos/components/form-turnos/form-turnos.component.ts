import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TurnosService } from '../../service/turnos.service';
import { ActivatedRoute } from '@angular/router';
import { Turnos } from '../../models/turnos';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { MatStepper } from '@angular/material/stepper';
import { HorariosComponent } from '../horarios/horarios.component';
import { EsquemaEventService } from '../../service/horarioesquema.service';

@Component({
  selector: 'app-form-turnos',
  templateUrl: './form-turnos.component.html',
  styleUrls: ['./form-turnos.component.css'],
})
export class FormTurnosComponent implements OnInit, AfterViewInit {
  @ViewChild('name') name: ElementRef;
  @ViewChild(HorariosComponent) horariosComponent: HorariosComponent;
  @ViewChild(MatStepper) stepper: MatStepper;
  turnoformGroup: FormGroup;
  shiftDetailsFormGroup: FormGroup;
  esquemaformGroup: FormGroup;
  titleButton: string;
  routeId: string;
  data: any;
  turnoList: Turnos[] = [];
  isEditable = true;
  shiftId: number;
  savingTurno: boolean = false;
  updateTurno: boolean = false;
  turnoGuardado: boolean = false;
  hasData: boolean = false;
  previousStepIndex: number = 0;
  isOptional: boolean = false;
  valueShift: number = 0;
  isLinear = false;
  shiftName: string;

  constructor(
    private _formBuilder: FormBuilder,
    private turnosService: TurnosService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private esquemaEventService: EsquemaEventService,
    private cd: ChangeDetectorRef
  ) {
    this.turnoformGroup = this._formBuilder.group({
      id: 0,
      name: ['', [Validators.required, Validators.maxLength(100)]],
      withFestive: [null, Validators.required],
      description: ['', Validators.maxLength(500)],
    });

    if (this.turnosService.turnos) {
      this.turnoformGroup.patchValue(this.turnosService.turnos);
      this.routeId = this.turnosService.turnos.id.toString();
    }

    if (this.routeId) {
      this.turnoformGroup.statusChanges.subscribe(() => {
        this.isLinear = !this.turnoformGroup.valid;
      });
    } else {
      this.isLinear = true;
    }

    this.setSecForm();
    this.esquemaformGroup = this._formBuilder.group({});
  }

  ngOnInit(): void {
    this.routeId = this.route.snapshot.params['id'];
    this.OnAction();
    this.setData();
    this.getShift();

    this.esquemaEventService.shiftId$.subscribe((id) => {
      if (id) {
        this.shiftId = id;
        this.turnoformGroup.get('id')?.setValue(this.shiftId);
      }
    });
  }

  ngAfterViewInit(): void {
    this.setFocus();
    this.cd.detectChanges();
  }

  setSecForm() {
    this.shiftDetailsFormGroup = this._formBuilder.group({
      id: 0,
      days: [''],
      startHour: '',
      endHour: '',
      shiftId: 0,
      continue: [null, Validators.required],
    });
  }

  setFocus() {
    this.name.nativeElement.focus();
  }


  dataLength(event: number) {
    if (event > 0) {
      this.shiftDetailsFormGroup.get('continue')?.clearValidators();
      this.shiftDetailsFormGroup.get('continue')?.updateValueAndValidity();
    }
    this.valueShift = event;
  }

  setData() {
    if (this.data && this.data.data) {
      this.getShift();
      this.turnoformGroup.patchValue(this.data.data);
      this.turnoformGroup.value;
    }
  }

  getShift() {
    this.turnosService.getTurnos().subscribe((res: Turnos[]) => {
      this.turnoList = res;
    });
  }

  getShiftById() {
    this.turnosService
      .getTurnosById(this.turnoformGroup.value)
      .subscribe((res: Turnos[]) => {
        this.turnoList = res;
      });
  }

  saveUpdateTurnos(goToBack: boolean, action: string = '') {
    this.turnoformGroup.markAllAsTouched();
    if (this.turnoformGroup.invalid) {
      return;
    }

    if (!this.routeId) {
      this.saveTurnos(goToBack, action);
    } else {
      this.updateTurnos(goToBack, action);
    }
  }

  saveTurnos(goToBack: boolean, action: string = '') {
    if (this.savingTurno) {
      return;
    }
    this.spinner.show();
    this.shiftName = this.turnoformGroup.get('name')?.value;
    this.esquemaEventService.setShiftSchemeName(this.shiftName);
    this.savingTurno = true;
    this.turnosService.saveTurnos(this.turnoformGroup.value).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          if (goToBack) {
            this.goBack();
          } else if (action === 'siguiente') {
            this.turnoGuardado = true;
            this.stepper.next();
          }
          this.esquemaEventService.notifyShiftId(response.result.id);
        } else {
          Alert.toastSWMessage('warning', response.message);
        }

        this.spinner.hide();
        this.savingTurno = false;
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
        this.savingTurno = false;
        this.stepper.selectedIndex = 0;
        return;
      },
    });
  }

  updateTurnos(goToBack: boolean, action: string = '') {
    if (this.updateTurno) {
      return;
    }
    this.spinner.show();
    this.shiftName = this.turnoformGroup.get('name')?.value;
    this.esquemaEventService.setShiftSchemeName(this.shiftName);
    this.updateTurno = true;
    this.turnosService.updateTurnos(this.turnoformGroup.value).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          if (goToBack) {
            this.goBack();
          } else if (action === 'siguiente') {
            this.turnoGuardado = true;
            this.stepper.next();
          }
          this.esquemaEventService.notifyShiftId(parseInt(this.routeId));
        } else {
          Alert.toastSWMessage('warning', response.message);
        }
        this.spinner.hide();
        this.updateTurno = false;
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
        this.updateTurno = false;
        this.stepper.selectedIndex = 0;
        return;
      },
    });
  }

  onStepChange(event: any) {
    const selectedIndex = event.selectedIndex;

    if (selectedIndex === 1 && event.previouslySelectedIndex !== 1) {
      this.saveUpdateTurnos(false);
      this.setSecForm();
    } else if (selectedIndex === 2 && event.previouslySelectedIndex !== 2) {
      this.esquemaEventService.notifyStepChange(selectedIndex);
      this.saveUpdateTurnos(false);
      this.shiftDetailsFormGroup.get('continue')?.clearValidators();
      this.shiftDetailsFormGroup.get('continue')?.updateValueAndValidity();
    } else if (event.selectedIndex === 0 && event.previouslySelectedIndex == 1) {
      this.shiftDetailsFormGroup.get('continue')?.clearValidators();
      this.shiftDetailsFormGroup.get('continue')?.updateValueAndValidity();
    } else if (event.selectedIndex === 2 && event.previouslySelectedIndex == 0) {
      this.esquemaEventService.notifyStepChange(selectedIndex);
    }
    this.previousStepIndex = selectedIndex;
  }

  goBack(): void {
    this.router.navigate(['/turnos']);
  }

  OnAction(): void {
    this.routeId = this.route.snapshot.params['id'];
    const action = this.route.snapshot.paramMap.get('action');
    if (action === 'editar') {
      this.titleButton = 'Guardar';
    }
  }
}
