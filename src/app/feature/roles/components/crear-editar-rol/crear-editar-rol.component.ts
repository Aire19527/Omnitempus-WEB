import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';



interface Usuario {
  value: string;
  viewValue: string;
}

interface Catalogo {
  value: string;
  viewValue: string;
}

interface Calendario {
  value: string;
  viewValue: string;
}

interface Perfil {
  value: string;
  viewValue: string;
}

interface Elemento {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-crear-editar-rol',
  templateUrl: './crear-editar-rol.component.html',
  styleUrls: ['./crear-editar-rol.component.css'],
})
export class CrearEditarRolComponent implements OnInit {

  checked = false;
  indeterminate = false;

  items = ['Catalogos', 'Calendario', 'Perfiles', 'Elementos'];


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  usuarios: Usuario[] = [
    {value: 'rol-0', viewValue: 'rol 1'},
    {value: 'rol-1', viewValue: 'rol 2'},
  ];

  catalogos: Catalogo[] = [
    {value: 'catalogo-0', viewValue: 'catalogo 1'},
    {value: 'catalogo-1', viewValue: 'catalogo 2'},
  ];

  calendarios: Calendario[] = [
    {value: 'calendario-0', viewValue: 'calendario 1'},
    {value: 'calendario-1', viewValue: 'calendario 2'},
  ];

  perfiles: Perfil[] = [
    {value: 'perfil-0', viewValue: 'perfil 1'},
    {value: 'perfil-1', viewValue: 'perfil 2'},
  ];

  elementos: Elemento[] = [
    {value: 'elemento-0', viewValue: 'elemento 1'},
    {value: 'elemento-1', viewValue: 'elemento 2'},
  ];


  RolesFormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    usuario: ['', Validators.required],
    descripcion: ['', Validators.required],
    cantidad: ['', Validators.required],
    catalogo: ['', Validators.required],
    calendario: ['', Validators.required],
    perfiles: ['', Validators.required],
    elementos: ['', Validators.required],
    cargos: false,
    ver: false,
    crear: false,
    editar: false,
    eliminar: false,
  });
}
