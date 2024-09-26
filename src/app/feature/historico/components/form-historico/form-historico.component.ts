import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuditDto } from '../../models/historico';

@Component({
  selector: 'app-form-historico',
  templateUrl: './form-historico.component.html',
  styleUrls: ['./form-historico.component.css'],
})
export class FormHistoricoComponent {
  constructor(
    public dialogRef: MatDialogRef<FormHistoricoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: AuditDto
  ) {
    console.log('detalle: ', this.data.detail);
  }
}
