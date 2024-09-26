import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Element } from '../../models/elemento';
import { ElementoCrearEditarComponent } from '../elemento-crear-editar/elemento-crear-editar.component';

@Component({
  selector: 'app-elemento',
  templateUrl: './elemento.component.html',
  styleUrls: ['./elemento.component.css'],
})
export class CatalogoElementoComponent implements OnInit {
  displayedColumns = [
    'code',
    'name',
    'typeElement',
    'classificationName',
    'distributionTypeName',
    'acciones',
  ];
  titleColumn = [
    'Código',
    'Nombre',
    'Tipo de elemento',
    'Clasificación de elemento',
    '¿Puesto o persona?',
    'Acciones',
  ];
  url = 'element';
  title = 'Elementos';
  changeUrl: boolean = false;
  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog(action: string, data?: Element): void {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(ElementoCrearEditarComponent, {
      width: '65%',
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

  dataEdit(data: Element) {
    this.openDialog('editar', data);
  }
}
