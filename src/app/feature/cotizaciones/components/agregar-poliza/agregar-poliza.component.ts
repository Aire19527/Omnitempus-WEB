import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { PolicyService } from '../../service/policy.service';
import { Policy } from '../../models/policy';
import { Alert } from 'src/app/helpers/alert_helper';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CotizacionesService } from '../../service/cotizaciones.service';

@Component({
  selector: 'app-agregar-poliza',
  templateUrl: './agregar-poliza.component.html',
  styleUrls: ['./agregar-poliza.component.css'],
})
export class AgregarPolizaComponent implements OnInit {
  isInsertOrEditrRoute: boolean = false;
  action: string | undefined;
  titleButton: string;
  polizaFormGroup: FormGroup;
  policyList: Policy[] = [];
  quotationPolicy: Policy[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AgregarPolizaComponent>,
    private _formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private spinner: NgxSpinnerService,
    private policyService: PolicyService,
  ) {
    this.action = data.title;
    this.polizaFormGroup = this._formBuilder.group({
      id: 0,
      policyId: [null, Validators.required],
      policyName: [''],
      quotationId: 0,
      percentage: [null, [Validators.required, Validators.max(100)]],
    });
  }

  ngOnInit(): void {
    this.onAction();
    this.getPolicy();

    if (this.action === 'editar' && this.data.data) {
      this.polizaFormGroup.patchValue({
        id: this.data.data.id,
        policyId: this.data.data.policyId,
        policyName: this.data.data.policyName,
        quotationId: this.data.data.quotationId,
        percentage: this.data.data.percentage,
      });
    }
  }

  getPolicy() {
    this.policyService.getPolicy().subscribe((res: Policy[]) => {
      this.policyList = res.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
  }

  onPolicySelectionChange(customer: any) {
    this.polizaFormGroup.get('percentage')?.setValue(customer.percentage);
  }

  saveUpdatePoliza() {
    if (this.polizaFormGroup.valid) {
      const selectedPolicy = this.policyList.find(
        (policy) => policy.id === this.polizaFormGroup.value.policyId
      );
      if (selectedPolicy) {
        selectedPolicy.percentage = this.percentage?.value;
        this.polizaFormGroup.patchValue({ policyName: selectedPolicy.name });
      }
      if (this.action === 'agregar') {
        const newQuotationPolicy: Policy = this.polizaFormGroup.value;
        this.quotationPolicy = this.quotationPolicy.concat(newQuotationPolicy);
        this.close(true, selectedPolicy, false);
      } else if (this.action === 'editar') {
        this.close(true, selectedPolicy, true);
      }
    } else {
      Alert.error('Por favor, complete todos los campos requeridos correctamente');
    }
  }

  close(close: boolean, selectedPolicy?: Policy, isEdit?: boolean) {
    if (selectedPolicy) {
      this.dialogRef.close({
        close,
        quotationPolicy: this.quotationPolicy,
        selectedPolicy,
        isEdit: isEdit
      });
    } else {
      this.dialogRef.close({ close, quotationPolicy: this.quotationPolicy });
    }
  }

  onAction(): void {
    if (this.action === 'agregar') {
      this.titleButton = 'Guardar';
    } else if (this.action === 'editar') {
      this.titleButton = 'Guardar';
    }
  }

  get policyId() {
    return this.polizaFormGroup.get('policyId');
  }

  get percentage() {
    return this.polizaFormGroup.get('percentage');
  }
}
