import { Component, OnInit } from '@angular/core';
import { ConsultSubchanger } from '../../models/subcargos';
import { filter } from 'rxjs';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { SubcargosService } from '../../service/subcargos.service';

@Component({
  selector: 'app-subcargos',
  templateUrl: './subcargos.component.html',
  styleUrls: ['./subcargos.component.css'],
})
export class SubcargosComponent implements OnInit {
  displayedColumns = ['position', 'name', 'acciones'];
  titleColumn = ['Cargo', 'Nombre', 'Acciones'];
  url = 'SubCharges';
  title = 'Subcargos';
  changeUrl: boolean = false;
  position: string;

  isInsertOrEditrRoute: boolean = false;
  constructor(private router: Router, private subcargosService: SubcargosService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRoute();
      });
  }
  private updateRoute(): void {
    this.isInsertOrEditrRoute = this.router.url.includes('editar');
    if (!this.isInsertOrEditrRoute) {
      this.isInsertOrEditrRoute = this.router.url.includes('crear');
    }
  }

  ngOnInit(): void {
    this.updateRoute();
    if (this.isInsertOrEditrRoute) {
      this.isInsertOrEditrRoute = false;
      this.router.navigateByUrl('catalogo/subcargos');
    }
  }


  dataCreate() {
    this.router.navigateByUrl('catalogo/subcargos/crear');
  }

  dataEdit(data: ConsultSubchanger) {
    const dato: NavigationExtras = { state: { data: data } };
    this.router.navigate(['catalogo/subcargos/editar', { action: 'editar', id: data.id }], dato);
  }
}
