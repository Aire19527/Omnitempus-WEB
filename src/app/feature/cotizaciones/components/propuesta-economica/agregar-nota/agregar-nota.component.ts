import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { EconomicProposalService } from '../../../service/economic-proposal.service';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { TextoCotizacionModel } from 'src/app/feature/catalogos/texto-cotizacion/models/textp-cotizacion';
import { QuotationNoteService } from '../../../service/quotation-note.service';
import { AddQuotationNoteDto } from '../../../models/cotizaciones';

@Component({
  selector: 'app-agregar-nota',
  templateUrl: './agregar-nota.component.html',
  styleUrls: ['./agregar-nota.component.css'],
})
export class AgregarNotaComponent implements OnInit {
  addNotaForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AgregarNotaComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      notasCotizaciones: TextoCotizacionModel[];
      quotationId: number;
    },
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private quotationNoteService: QuotationNoteService
  ) {
    this.addNotaForm = this._formBuilder.group({
      quoteTextId: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  saveAddNote() {
    this.addNotaForm.markAllAsTouched();
    if (this.addNotaForm.invalid) {
      return;
    }
    this.spinner.show();

    const quoteTextId = this.addNotaForm.get('quoteTextId')?.value;
    const add: AddQuotationNoteDto = {
      quotationsId: this.data.quotationId,
      quoteTextId: quoteTextId,
    };

    this.quotationNoteService.insert(add).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          this.dialogRef.close(true);
          Alert.toastSWMessage('success', response.message);
        } else {
          Alert.warning(response.message);
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
