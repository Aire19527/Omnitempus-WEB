import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Providers } from '../../models/proveedores';
import { filter } from 'rxjs';
import { ProveedoresService } from '../../service/proveedores.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
})
export class ProveedoresComponent implements OnInit {
  displayedColumns = ['name', 'nit', 'acciones'];
  titleColumn = ['Nombre', 'Nit', 'Acciones'];
  url = 'Suppliers';
  title = 'Gestión de proveedores';
  changeUrl: boolean = false;

  isInsertOrEditrRoute: boolean = false;
  constructor(private router: Router,private proveedoresService: ProveedoresService ) {
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
      this.router.navigateByUrl('proveedores');
    }
  }

  dataCreate() {
    this.router.navigate(['proveedores/crear']);
  }

  dataEdit(data: Providers) {
    this.router.navigate(['proveedores/editar',{ action: 'editar', id: data.id }]);
  }
}
