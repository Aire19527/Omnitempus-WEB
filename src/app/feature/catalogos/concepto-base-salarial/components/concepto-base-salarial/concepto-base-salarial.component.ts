import { Component, OnInit } from '@angular/core';
import { ConceptoBaseSalarialModel} from '../../models/concepto-base-salarial-model';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-concepto-base-salarial',
  templateUrl: './concepto-base-salarial.component.html',
  styleUrls: ['./concepto-base-salarial.component.css'],
})
export class ConceptoBaseSalarialComponent implements OnInit {
  displayedColumns = ['name', 'acciones'];
  titleColumn = ['Nombre', 'Acciones'];
  url = 'salaryBaseConcepts';
  title = 'Condiciones salariales';

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
      this.router.navigateByUrl('catalogo/conceptoBaseSalarial');
    }
  }

  dataCreate() {
    this.router.navigateByUrl('catalogo/conceptoBaseSalarial/crear');
  }

  dataEdit(data: ConceptoBaseSalarialModel) {
    this.router.navigate([
      'catalogo/conceptoBaseSalarial/editar',
      { action: 'editar', id: data.id },
    ]);
  }
}
