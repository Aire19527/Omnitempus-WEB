import { Component, OnInit } from '@angular/core';
import { AddSalaryType} from '../../models/tipos-salarios';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-tipo-salario',
  templateUrl: './tipo-salario.component.html',
  styleUrls: ['./tipo-salario.component.css'],
})
export class TipoSalarioComponent implements OnInit {
  displayedColumns = ['name', 'acciones'];
  titleColumn = ['Nombre', 'Acciones'];
  url = 'SalaryType';
  title = 'Tipos de salario';

  changeUrl: boolean = false;
  isInsertOrEditrRoute: boolean = false;
  constructor(private router: Router) {
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
      this.router.navigateByUrl('catalogo/tipoSalarios');
    }
  }

  dataCreate() {
    this.router.navigateByUrl('catalogo/tipoSalarios/crear');
  }

  dataEdit(data: AddSalaryType) {
    this.router.navigate([
      'catalogo/tipoSalarios/editar',
      { action: 'editar', id: data.id },
    ]);
  }
}
