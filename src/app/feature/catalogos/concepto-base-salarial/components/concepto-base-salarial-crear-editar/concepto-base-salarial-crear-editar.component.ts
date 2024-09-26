import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConceptoBaseSalarialService } from '../../service/concepto-base-salarial.service';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-concepto-base-salarial-crear-editar',
  templateUrl: './concepto-base-salarial-crear-editar.component.html',
  styleUrls: ['./concepto-base-salarial-crear-editar.component.css'],
})
export class ConceptoBaseSalarialCrearEditarComponent
  implements OnInit, AfterViewInit {
  @ViewChild('name') name: ElementRef;
  titleButton: string;
  conceptoBaseSalarialFormGroup: FormGroup;
  action: string | undefined;
  routeId: string;
  data: any;
  changeTitle: string | undefined;

  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private conceptoBaseSalarialService: ConceptoBaseSalarialService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef
  ) {
    this.conceptoBaseSalarialFormGroup = this._formBuilder.group({
      id: 0,
      name: ['', Validators.required],
      hasSeverancePay: ['', Validators.required],
      hasBonus: ['', Validators.required],
      hasVacation: ['', Validators.required],
      hasEps: ['', Validators.required],
      hasArl: ['', Validators.required],
      hasRetirement: ['', Validators.required],
      hasICBF: ['', Validators.required],
      hasSena: ['', Validators.required],
      hasExtraHours: ['', Validators.required],
      applyAssistance: [false],
      salaryConceptTypes: [null, Validators.required],
      hasSeveranceInterest: ['', Validators.required],
      hasLegalTransportSubsidy: ['', Validators.required],
      hasCompensationBox: ['', Validators.required],
    });
  }
  ngAfterViewInit(): void {
    this.setFocus();
    this.cd.detectChanges();
  }

  setFocus() {
    this.name.nativeElement.focus();
  }

  ngOnInit(): void {
    this.onAction();
    this.getSalaryBaseConceptsById();
  }

  getSalaryBaseConceptsById() {
    if (this.routeId) {
      this.conceptoBaseSalarialService
        .getById(parseInt(this.routeId))
        .subscribe({
          next: (result: any) => {
            this.conceptoBaseSalarialFormGroup.patchValue(result.result);
            if (result.result.id === 1) {
              const nameControl = this.conceptoBaseSalarialFormGroup.get('name');
              if (nameControl) {
                nameControl.disable();
              }
            }

          },
          error(error) {
            console.error('Error al obtener el tipo de salario por ID', error);
            Alert.errorHttp(error);
          },
        });
    }
  }

  submit() {
    this.conceptoBaseSalarialFormGroup.markAllAsTouched();
    if (this.conceptoBaseSalarialFormGroup.invalid) {
      return;
    }
    if (!this.routeId) {
      this.save();
    } else {
      this.update();
    }
  }

  save() {
    this.spinner.show();
    this.conceptoBaseSalarialService
      .save(this.conceptoBaseSalarialFormGroup.value)
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

  update() {
    this.spinner.show();
    this.conceptoBaseSalarialService
      .update(this.conceptoBaseSalarialFormGroup.value)
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

  goBack() {
    this.router.navigate(['/catalogo/conceptoBaseSalarial']);
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
