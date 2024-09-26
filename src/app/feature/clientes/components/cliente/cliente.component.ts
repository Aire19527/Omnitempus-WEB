import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from '../../models/clientes';
import { ClienteCrearEditarComponent } from '../cliente-crear-editar/cliente-crear-editar.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
  displayedColumns = ['name', 'nit', 'payTypeSunday', 'acciones'];
  titleColumn = ['Nombre', 'Nit', 'Tipo de pago dominical', 'Acciones'];
  url = 'Customers';
  title = 'Clientes';

  changeUrl: boolean = false;

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog(data?: Cliente): void {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(ClienteCrearEditarComponent, {
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

  dataEdit(data: Cliente) {
    this.openDialog(data);
  }
}
