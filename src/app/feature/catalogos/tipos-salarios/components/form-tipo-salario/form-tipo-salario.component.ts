import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TiposSalariosService } from '../../services/tipos-salarios.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { SalaryType } from '../../models/tipos-salarios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-form-tipo-salario',
  templateUrl: './form-tipo-salario.component.html',
  styleUrls: ['./form-tipo-salario.component.css'],
})
export class FormTipoSalarioComponent implements OnInit, AfterViewInit {
  @ViewChild('mySelect') mySelect: MatSelect;
  action: string | undefined;
  changeTitle: string | undefined;
  salaryTypeForm: FormGroup;
  titleButton: string;
  routeId: string;
  data: any;
  salaryList: SalaryType[] = [];

  salaryTypeList = [
    { value: 'Sueldo básico', name: 'Sueldo básico' },
    {
      value: 'Sueldo mayor o igual a 10 SMMLV',
      name: 'Sueldo mayor o igual a 10 SMMLV',
    },
    { value: 'Salario integral', name: 'Salario integral' },
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private serviceSalaryType: TiposSalariosService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef
  ) {
    this.salaryTypeForm = this._formBuilder.group({
      id: 0,
      name: ['', [Validators.required]],
      hasSeverancePay: ['', Validators.required],
      hasSeveranceInterest: ['', Validators.required],
      hasLegalTransportSubsidy: ['', Validators.required],
      hasBonus: ['', Validators.required],
      hasVacation: ['', Validators.required],
      hasEps: ['', Validators.required],
      hasArl: ['', Validators.required],
      hasRetirement: ['', Validators.required],
      hasICBF: ['', Validators.required],
      hasSena: ['', Validators.required],
      hasExtraHours: ['', Validators.required],
      hasCompensationBox: ['', Validators.required],
      applyAssistance: [false],
    });
  }

  ngOnInit(): void {
    this.onAction();
    this.getSalaryType();
    this.getSalaryTypeById();
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

  getSalaryType() {
    this.serviceSalaryType.getSalaryType().subscribe((res) => {
      this.salaryList = res;
    });
  }

  getSalaryTypeById() {
    if (this.routeId) {
      this.serviceSalaryType.getSalaryTypeById(this.routeId).subscribe(
        (res: any) => {
          this.salaryTypeForm.patchValue(res.result);
        },
        (error) => {
          console.error('Error al obtener el tipo de salario por ID', error);
        }
      );
    }
  }

  saveUpdateSalaryType() {
    this.salaryTypeForm.markAllAsTouched();
    if (this.salaryTypeForm.invalid) {
      return;
    }

    if (!this.routeId) {
      this.spinner.show();
      this.serviceSalaryType
        .saveSalaryType(this.salaryTypeForm.value)
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
    } else {
      this.spinner.show();
      this.serviceSalaryType
        .updateSalaryType(this.salaryTypeForm.value)
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
  }

  goBack() {
    this.router.navigate(['/catalogo/tipoSalarios']);
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
}
