import { Component, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';
import { StateChangeService } from '../../../service/state-change.service';
import { NewStates } from '../../../models/cambiar-estado';
import { CotizacionesService } from '../../../service/cotizaciones.service';
import { Subscription } from 'rxjs';

const statusText: { [key: number]: string } = {
  0: 'Borrador',
  1: 'Anulada',
  2: 'Solicitada',
  3: 'Revisión Costos',
  4: 'Generada',
  5: 'Enviada al Solicitante',
  6: 'Enviada al Cliente',
  7: 'Aprobada',
  8: 'Reemplazada',
  9: 'No Aprobada'
};

@Component({
  selector: 'app-cambiar-estado',
  templateUrl: './cambiar-estado.component.html',
  styleUrls: ['./cambiar-estado.component.css']
})

export class CambiarEstadoComponent {

  action: string | undefined;
  stateChangeForm: FormGroup;
  stateChangeList: NewStates[] = [];
  statusId: number;
  quotationId: number;
  statusName: string;
  filterStatus: NewStates[] = [];
  statusIdSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<CambiarEstadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private stateChangeService: StateChangeService,
    private spinner: NgxSpinnerService,
    private cotizacionesService: CotizacionesService
  ) {
    this.action = data.title;
    this.stateChangeForm = this._formBuilder.group({
      quotationId: 0,
      lastStatusId: [{ value: null, disabled: true }],
      newStatusId: [null, Validators.required],
      observations: [''],
    });
  }

  ngOnInit(): void {
    this.getStateChange();
    this.setExchangeValue();
    this.setValidation();

    this.cotizacionesService.statusId$.subscribe((statusId) => {
      this.statusId = statusId;
      this.setExchangeValue();
    });
  }

  setValidation() {
    this.stateChangeForm.get('newStatusId')?.valueChanges.subscribe(newStatus => {
      const observationsControl = this.stateChangeForm.get('observations');
      if (newStatus === 1 || newStatus === 8 || newStatus === 9) {
        observationsControl?.setValidators([Validators.required, Validators.maxLength(500)]);
      } else {
        observationsControl?.clearValidators();
      }
      observationsControl?.updateValueAndValidity();
    });
  }

  setExchangeValue() {
    this.statusId = this.cotizacionesService.getStatusId();
    this.quotationId = this.cotizacionesService.getQuotationId();
    this.statusName = this.cotizacionesService.getStatusName();
    if (this.statusId in statusText) {
      this.stateChangeForm.patchValue({
        lastStatusId: statusText[this.statusId],
        quotationId: this.quotationId,
      });
    } else {
      this.stateChangeForm.patchValue({
        lastStatusId: this.statusId,
        quotationId: this.quotationId,
      });
    }
  }

  getStateChange() {
    this.stateChangeService.getStateChange().subscribe({
      next: (res: NewStates[]) => {
        this.stateChangeList = res;
        const lastStatusIdValue = this.statusId;
        if (lastStatusIdValue === 0) {
          this.filterStatus = this.stateChangeList.filter(state => state.key === 1);
        } else if (lastStatusIdValue === 2) {
          this.filterStatus = this.stateChangeList.filter(state => state.key === 1 || state.key === 3 || state.key === 4);
        } else if (lastStatusIdValue === 3) {
          this.filterStatus = this.stateChangeList.filter(state => state.key === 1 || state.key === 4);
        } else if (lastStatusIdValue === 4) {
          this.filterStatus = this.stateChangeList.filter(state => state.key === 5 || state.key === 6);
        } else if (lastStatusIdValue === 5) {
          this.filterStatus = this.stateChangeList.filter(state => state.key === 6);
        } else if (lastStatusIdValue === 6) {
          this.filterStatus = this.stateChangeList.filter(state => state.key === 7 || state.key === 8 || state.key === 9);
        } else {
          this.filterStatus = []
        }
      }
    });
  }

  saveStateChange() {
    this.stateChangeForm.markAllAsTouched();
    if (this.stateChangeForm.invalid) {
      return;
    }
    if (this.action === 'crear') {
      this.spinner.show();
      const selectedStatusId = this.statusId;
      const newStatusId = this.stateChangeForm.get('newStatusId')?.value;
      const newStatusName = statusText[newStatusId];
      this.stateChangeService.saveStateChange({ ...this.stateChangeForm.value, lastStatusId: selectedStatusId }).subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
            this.cotizacionesService.setStatusName(newStatusName);
          } else {
            Alert.toastSWMessage('warning', response.message);
          }
          this.close(true, newStatusName);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
    }
  }

  close(isEdit: boolean, newStatuName: string) {
    this.cotizacionesService.setStatusId(this.stateChangeForm.get('newStatusId')?.value); 
    this.dialogRef.close({ isEdit: isEdit, newStatusName: newStatuName });
  }

  get lastStatusId() { return this.stateChangeForm.get('lastStatusId'); }
  get newStatusId() { return this.stateChangeForm.get('newStatusId'); }
  get observations() { return this.stateChangeForm.get('observations'); }
}
