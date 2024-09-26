import { Component, OnInit } from '@angular/core';
import { Areas } from '../../models/areas';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationExtras,
  Router,
} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css'],
})
export class AreasComponent implements OnInit {
  displayedColumns = ['name', 'groupId', 'description', 'acciones'];
  titleColumn = ['Nombre', 'Código', 'Descripción', 'Acciones'];
  url = 'Areas';
  title: string = 'Áreas';

  changeUrl: boolean = false;
  isInsertOrEditrRoute: boolean = false;
  constructor(private router: Router) {
    // Escucha los eventos de navegación para actualizar la propiedad
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRoute();
      });
  }

  ngOnInit(): void {
    this.updateRoute();
    if (this.isInsertOrEditrRoute) {
      this.isInsertOrEditrRoute = false;
      this.router.navigateByUrl('catalogo/areas');
    }
  }

  private updateRoute(): void {
    // Verifica si la ruta actual incluye 'crear-editar'
    this.isInsertOrEditrRoute = this.router.url.includes('editar');
    if (!this.isInsertOrEditrRoute) {
      this.isInsertOrEditrRoute = this.router.url.includes('crear');
    }
  }

  dataCreate() {
    this.router.navigateByUrl('catalogo/areas/crear');
  }

  dataEdit(data: Areas) {
    const dato: NavigationExtras = { state: { data: data } };
    this.router.navigate(['catalogo/areas/editar'], dato);
  }
}
