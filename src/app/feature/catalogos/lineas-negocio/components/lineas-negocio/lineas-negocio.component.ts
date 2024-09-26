import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BusinessLines } from '../../models/lineasNegocio';
import { FormLineasNegocioComponent } from '../form-lineas-negocio/form-lineas-negocio.component';

@Component({
  selector: 'app-lineas-negocio',
  templateUrl: './lineas-negocio.component.html',
  styleUrls: ['./lineas-negocio.component.css'],
})
export class LineasNegocioComponent implements OnInit {
  displayedColumns = ['code', 'name', 'acciones'];
  titleColumn = ['Código', 'Nombre', 'Acciones'];
  url = 'BusinessLines';
  title = 'Líneas de negocio';
  changeUrl: boolean = false;

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog(action: string, data?: BusinessLines): void {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(FormLineasNegocioComponent, {
      width: '50%',
      data: { title: action, data: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeUrl = result;
      }
    });
  }

  dataCreate() {
    this.openDialog('crear');
  }

  dataEdit(data: BusinessLines) {
    this.openDialog('editar', data);
  }
}
