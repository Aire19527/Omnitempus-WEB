import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  
  displayedColumns = ['Administrador', 'Supervisor', 'Asesor Ventas', 'Asstente Ventas', 'Gerente'];
  titleColumn = ['Nombre', 'Usuarios', 'Acciones'];

  constructor() { }

  ngOnInit(): void {
  }

}
