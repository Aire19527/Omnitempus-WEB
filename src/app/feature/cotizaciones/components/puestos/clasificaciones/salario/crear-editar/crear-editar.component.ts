import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConceptoBaseSalarialModel } from 'src/app/feature/catalogos/concepto-base-salarial/models/concepto-base-salarial-model';
import { SalaryBaseConceptsQuotationDto } from 'src/app/feature/catalogos/subcargos/models/elementsProvider';
import { SalaryBaseConceptsEstimateService } from 'src/app/feature/cotizaciones/service/salary-base-concepts-estimate.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';

@Component({
  selector: 'app-crear-editar',
  templateUrl: './crear-editar.component.html',
  styleUrls: ['./crear-editar.component.css'],
})
export class CrearEditarComponent implements OnInit {
  conceptFormGroup: FormGroup;
  filteredConcepts: ConceptoBaseSalarialModel[] = [];

  constructor(
    public dialogRef: MatDialogRef<CrearEditarComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      salary: SalaryBaseConceptsQuotationDto;
      concepts: ConceptoBaseSalarialModel[];
      subChargesQuotationId: number;
    },
    private _formBuilder: FormBuilder,
    private salaryBaseConceptsEstimateService: SalaryBaseConceptsEstimateService,
    private spinner: NgxSpinnerService
  ) {
    this.filteredConcepts = this.data.concepts.filter(
      (concept) =>
        !['Día 31', 'Auxilio de transporte', 'Sueldo básico'].includes(
          concept.name
        )
    );

    this.conceptFormGroup = this._formBuilder.group({
      salaryBaseConceptId: [{ value: 0 }, Validators.required],
      value: ['', [Validators.required]],
    });
    this.conceptFormGroup.patchValue(this.data.salary);
  }

  ngOnInit(): void {
    if (this.data.salary) {
      this.conceptFormGroup.get('salaryBaseConceptId')?.disable();
    }
  }

  save() {
    if (this.data.salary) {
      this.update();
    } else {
      this.insert();
    }
  }

  update() {
    const idConcept = this.conceptFormGroup.get('salaryBaseConceptId')?.value;
    const concept = this.data.concepts.find((x) => x.id == idConcept)?.name!;
    const salaryBaseConceptsQuotation: SalaryBaseConceptsQuotationDto = {
      salaryBaseConceptId: idConcept,
      value: this.conceptFormGroup.get('value')?.value,
      subChargesQuotationId: this.data.subChargesQuotationId,
      concept: concept,
      id: this.data.salary.id,
    };

    this.spinner.show();
    this.salaryBaseConceptsEstimateService
      .update(salaryBaseConceptsQuotation)
      .subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
          } else {
            Alert.toastSWMessage('warning', response.message);
          }
          this.dialogRef.close(true);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }

  insert() {
    const idConcept = this.conceptFormGroup.get('salaryBaseConceptId')?.value;
    const concept = this.data.concepts.find((x) => x.id == idConcept)?.name!;
    const salaryBaseConceptsQuotation: SalaryBaseConceptsQuotationDto = {
      salaryBaseConceptId: idConcept,
      value: this.conceptFormGroup.get('value')?.value,
      subChargesQuotationId: this.data.subChargesQuotationId,
      concept: concept,
      id: 0,
    };
    this.spinner.show();
    this.salaryBaseConceptsEstimateService
      .insert(salaryBaseConceptsQuotation)
      .subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
          } else {
            Alert.toastSWMessage('warning', response.message);
          }
          this.dialogRef.close(true);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }
}
