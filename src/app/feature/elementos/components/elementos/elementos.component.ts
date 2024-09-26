import { Component, OnInit } from '@angular/core';
import { Elemento } from '../../models/elementos';
import { MatDialog } from '@angular/material/dialog';
import { FormElementosComponent } from '../form-elementos/form-elementos.component';
import { FormatField } from 'src/app/shared/components/models/formatFieldDto';
import { MONEDA } from 'src/app/helpers/constants';

@Component({
  selector: 'app-elementos',
  templateUrl: './elementos.component.html',
  styleUrls: ['./elementos.component.css'],
})
export class ElementosComponent implements OnInit {
  displayedColumns = [
    'supplierName',
    'elementTypeName',
    'elementName',
    'unitPrice',
    'acciones',
  ];
  titleColumn = [
    'Proveedor',
    'Tipo de elemento',
    'Elemento',
    'Costo por unidad',
    'Acciones',
  ];
  url = 'elementProvider';
  title = 'Compras';
  changeUrl: boolean = false;

  formatField: FormatField = {
    field: 'Costo por unidad',
    format: MONEDA,
  };

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog(action: string, data?: Elemento): void {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(FormElementosComponent, {
      width: '60%',
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

  dataEdit(data: Elemento) {
    this.openDialog('editar', data);
  }
}
