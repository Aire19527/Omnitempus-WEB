import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TextoCotizacionModel } from '../../models/textp-cotizacion';
import { TextoCotizacionCrearEditarComponent } from '../texto-cotizacion-crear-editar/texto-cotizacion-crear-editar.component';

@Component({
  selector: 'app-texto-cotizacion',
  templateUrl: './texto-cotizacion.component.html',
  styleUrls: ['./texto-cotizacion.component.css'],
})
export class TextoCotizacionComponent implements OnInit {
  displayedColumns = ['name', 'noteText', 'acciones'];
  titleColumn = ['Nombre', 'Texto de nota', 'Acciones'];
  url = 'QuoteText';
  title = 'Notas de cotizaciones';

  changeUrl: boolean = false;

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog(data?: TextoCotizacionModel): void {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(TextoCotizacionCrearEditarComponent, {
      width: '60%',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeUrl = result;
      }
    });
  }

  dataCreate() {
    this.openDialog();
  }

  dataEdit(data: TextoCotizacionModel) {
    this.openDialog(data);
  }
}
