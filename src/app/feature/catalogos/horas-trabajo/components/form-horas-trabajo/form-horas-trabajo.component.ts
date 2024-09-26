import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddWorkHours, TypeOvertimeModel } from '../../models/horas-trabajo';
import { HorasTrabajoService } from '../../services/horas-trabajo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';

@Component({
  selector: 'app-form-horas-trabajo',
  templateUrl: './form-horas-trabajo.component.html',
  styleUrls: ['./form-horas-trabajo.component.css'],
})
export class FormHorasTrabajoComponent implements OnInit, AfterViewInit {
  @ViewChild('abreviatura') abreviatura: ElementRef;
  action: string | undefined;
  changeTitle: string | undefined;
  wourkHoursFormGroup: FormGroup;
  titleButton: string;
  routeId: string;
  data: any;
  wourkHoursList: AddWorkHours[] = [];
  days: string[] = [];

  isActiveMonday: boolean = false;
  isActiveTuesday: boolean = false;
  isActiveWednesday: boolean = false;
  isActiveThursday: boolean = false;
  isActiveFriday: boolean = false;
  isActiveSaturday: boolean = false;
  isActiveSunday: boolean = false;
  overtimeHours: string[] = ['<= 8', '> 8'];
  typeOvertimes: TypeOvertimeModel[] = [];
  constructor(
    private _formBuilder: FormBuilder,
    private workHoursService: HorasTrabajoService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef
  ) {
    this.wourkHoursFormGroup = this._formBuilder.group({
      id: 0,
      name: ['', [Validators.required, Validators.maxLength(100)]],
      abbreviation: ['', [Validators.required, Validators.maxLength(3)]],
      weekDays: [''],
      surchargePercentageAdjusted: null,
      initialTime: ['', Validators.required],
      endTime: ['', [Validators.required]],
      overtimeCount: [null, [Validators.required]],
      idTypeOvertime: [null, [Validators.required]],
      hourType: [null],
      surchargePercentageOT: null,
    });
  }

  ngOnInit(): void {
    this.onAction();
    this.getWourkHoursById();
    this.getAllTypeOvertime();
  }
  ngAfterViewInit(): void {
    this.setFocus();
    this.cd.detectChanges();
  }

  setFocus() {
    this.abreviatura.nativeElement.focus();
  }

  getWourkHoursById(): void {
    if (this.routeId) {
      this.workHoursService.getWourHoursById(this.routeId).subscribe({
        next: (res: any) => {
          this.wourkHoursFormGroup.patchValue(res);
          const paymentTypeValue = res.paymentType === 'OT' ? 0 : 1;
          this.wourkHoursFormGroup
            .get('paymentType')
            ?.setValue(paymentTypeValue);
          this.wourkHoursFormGroup
            .get('initialTime')
            ?.setValue(res.initialTime);
          this.wourkHoursFormGroup.get('endTime')?.setValue(res.endTime);
          const data = JSON.parse(this.weekDays?.value);
          this.validateDayActive(data);
          this.days = data;
        },
        error: () => {
          console.error('Error al obtener las horas de trabajo por ID');
        },
      });
    }
  }

  formatTime(value: string): string {
    if (!value) {
      return '';
    }
    const hours = value.substring(0, 2);
    const minutes = value.substring(2);
    return `${hours}:${minutes}`.replace('::', ':');
  }

  convertHours() {
    const initialHourValue = this.initialTime?.value;
    const endHourValue = this.endTime?.value;
    const initialHourFormatted = this.formatTime(initialHourValue);
    const endHourFormatted = this.formatTime(endHourValue);
    this.wourkHoursFormGroup.get('initialTime')?.setValue(initialHourFormatted);
    this.wourkHoursFormGroup.get('endTime')?.setValue(endHourFormatted);

    this.weekDays?.setValue(JSON.stringify(this.days));
  }

  saveUpdateWourkHours(): void {
    this.wourkHoursFormGroup.markAllAsTouched();
    if (
      this.wourkHoursFormGroup.invalid ||
      !this.endTime?.value ||
      !this.initialTime?.value
    ) {
      return;
    }

    if (
      this.wourkHoursFormGroup.get('surchargePercentageAdjusted')?.value === ''
    ) {
      this.wourkHoursFormGroup
        .get('surchargePercentageAdjusted')
        ?.setValue(null);
    }

    if (this.wourkHoursFormGroup.get('surchargePercentageOT')?.value === '') {
      this.wourkHoursFormGroup.get('surchargePercentageOT')?.setValue(null);
    }

    this.convertHours();
    if (!this.routeId) {
      this.save();
    } else {
      this.update();
    }
  }

  save(): void {
    this.spinner.show();
    this.workHoursService
      .saveWourHours(this.wourkHoursFormGroup.value)
      .subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
          } else {
            Alert.toastSWMessage('warning', response.message);
          }
          this.goBack();
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }

  update(): void {
    this.spinner.show();
    this.workHoursService
      .updateWourHours(this.wourkHoursFormGroup.value)
      .subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
          } else {
            Alert.toastSWMessage('warning', response.message);
          }
          this.goBack();
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }

  addDays(day: string): void {
    this.validateDay(day);
    if (!this.days.includes(day)) {
      this.days.push(day);
    } else {
      this.days = this.days.filter((res: string) => res !== day);
    }
  }

  validateDayActive(data: string[]) {
    data.forEach((day) => {
      this.validateDay(day);
    });
  }

  validateDay(day: string) {
    switch (day) {
      case 'Lunes':
        this.isActiveMonday = !this.isActiveMonday;
        break;
      case 'Martes':
        this.isActiveTuesday = !this.isActiveTuesday;
        break;
      case 'Miércoles':
        this.isActiveWednesday = !this.isActiveWednesday;
        break;
      case 'Jueves':
        this.isActiveThursday = !this.isActiveThursday;
        break;
      case 'Viernes':
        this.isActiveFriday = !this.isActiveFriday;
        break;
      case 'Sábado':
        this.isActiveSaturday = !this.isActiveSaturday;
        break;
      case 'Domingo':
        this.isActiveSunday = !this.isActiveSunday;
        break;
      default:
        break;
    }
  }

  goBack() {
    this.router.navigate(['/catalogo/horasTrabajo']);
  }

  onAction(): void {
    this.routeId = this.route.snapshot.params['id'];
    const action = this.route.snapshot.paramMap.get('action');

    if (action === 'editar') {
      this.titleButton = 'Guardar';
      this.changeTitle = 'Editar';
    } else {
      this.titleButton = 'Guardar';
      this.changeTitle = 'Crear';
    }
  }

  onInput(event: any): void {
    const inputValue = event.target.value;
    const match = inputValue.match(/^\d{1,3}(\.\d{0,2})?$/);
    if (match) {
      this.wourkHoursFormGroup.get('percentaje')?.setValue(match[0]);
    } else {
      const currentValue =
        this.wourkHoursFormGroup.get('percentaje')?.value || '';
      this.wourkHoursFormGroup
        .get('percentaje')
        ?.setValue(currentValue.slice(0, -1));
    }
  }

  getAllTypeOvertime() {
    this.spinner.show();
    this.workHoursService.getAllTypeOvertime().subscribe({
      next: (result: TypeOvertimeModel[]) => {
        this.typeOvertimes = result;
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        console.error(error);
        Alert.errorHttp(error);
      },
    });
  }

  get weekDays() {
    return this.wourkHoursFormGroup.get('weekDays');
  }
  get endTime() {
    return this.wourkHoursFormGroup.get('endTime');
  }
  get initialTime() {
    return this.wourkHoursFormGroup.get('initialTime');
  }
  get abbreviation() {
    return this.wourkHoursFormGroup.get('abbreviation');
  }
  get overtimeCount() {
    return this.wourkHoursFormGroup.get('overtimeCount');
  }
  get name() {
    return this.wourkHoursFormGroup.get('name');
  }
}
