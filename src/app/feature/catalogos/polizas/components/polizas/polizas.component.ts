import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PolizasCrearEditarComponent } from '../polizas-crear-editar/polizas-crear-editar.component';
import { PolizaModel } from '../../models/poliza';
import { FormatField } from 'src/app/shared/components/models/formatFieldDto';
import { PORCENTAJE } from 'src/app/helpers/constants';

@Component({
  selector: 'app-polizas',
  templateUrl: './polizas.component.html',
  styleUrls: ['./polizas.component.css'],
})
export class PolizasComponent implements OnInit {
  displayedColumns = ['name', 'percentage', 'acciones'];

  titleColumn = ['Nombre', 'Porcentaje', 'Acciones'];
  url = 'policy';
  title = 'Pólizas';
  changeUrl: boolean = false;
  formatField: FormatField = {
    field: 'Porcentaje',
    format: PORCENTAJE,
  };

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {}

  async openDialog(data?: PolizaModel) {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(PolizasCrearEditarComponent, {
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

  dataEdit(data: PolizaModel) {
    this.openDialog(data);
  }
}
