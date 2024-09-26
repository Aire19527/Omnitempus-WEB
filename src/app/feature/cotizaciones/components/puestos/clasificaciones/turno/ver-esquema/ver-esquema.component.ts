import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EsqeuemaHorarioPersona } from 'src/app/feature/catalogos/turnos/models/horarios';

@Component({
  selector: 'app-ver-esquema',
  templateUrl: './ver-esquema.component.html',
  styleUrls: ['./ver-esquema.component.css'],
})
export class VerEsquemaComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<VerEsquemaComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      esquemas: EsqeuemaHorarioPersona[];
    }
  ) {}

  ngOnInit(): void {}
}
