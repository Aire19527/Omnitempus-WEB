import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Risk } from '../../models/riesgos';
import { FormRiesgosArlComponent } from '../form-riesgos-arl/form-riesgos-arl.component';
import { PORCENTAJE } from 'src/app/helpers/constants';
import { FormatField } from 'src/app/shared/components/models/formatFieldDto';

@Component({
  selector: 'app-riesgos-arl',
  templateUrl: './riesgos-arl.component.html',
  styleUrls: ['./riesgos-arl.component.css'],
})
export class RiesgosArlComponent implements OnInit {
  displayedColumns = ['name', 'percentage', 'acciones'];
  titleColumn = ['Nombre', 'Porcentaje', 'Acciones'];
  url = 'Risk';
  title = 'Riesgos ARL';
  changeUrl: boolean = false;
  formatField: FormatField = {
    field: 'Porcentaje',
    format: PORCENTAJE,
  };
  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog(data?: Risk): void {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(FormRiesgosArlComponent, {
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

  dataEdit(data: Risk) {
    this.openDialog(data);
  }
}
