import { Component, OnInit } from '@angular/core';
import { WorkHours } from '../../models/horas-trabajo';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { FormatField } from 'src/app/shared/components/models/formatFieldDto';
import { PORCENTAJE } from 'src/app/helpers/constants';

@Component({
  selector: 'app-horas-trabajo',
  templateUrl: './horas-trabajo.component.html',
  styleUrls: ['./horas-trabajo.component.css'],
})
export class HorasTrabajoComponent implements OnInit {
  displayedColumns = ['name', 'abbreviation', 'surchargePercentageAdjusted', 'surchargePercentageOT', 'acciones'];
  titleColumn = ['Nombre', 'Abreviatura', 'Recargo ajustado', 'Recargo OT', 'Acciones'];
  url = 'OvertimeSurcharges';
  title = 'Horas de trabajo';
  changeUrl: boolean = false;
  formatField: FormatField = {
    field: 'Recargo ajustado', 
    format: PORCENTAJE,
  };
  formatFieldSecond: FormatField = {
    field: 'Recargo OT', 
    format: PORCENTAJE,
  }
  isInsertOrEditrRoute: boolean = false;
  constructor(private router: Router) {
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
      this.router.navigateByUrl('catalogo/horasTrabajo');
    }
  }

  private updateRoute(): void {
    this.isInsertOrEditrRoute = this.router.url.includes('editar');
    if (!this.isInsertOrEditrRoute) {
      this.isInsertOrEditrRoute = this.router.url.includes('crear');
    }
  }
 
  dataCreate() {
    this.router.navigateByUrl('catalogo/horasTrabajo/crear');
  }

  dataEdit(data: WorkHours) {
    this.router.navigate([
      'catalogo/horasTrabajo/editar',
      { action: 'editar', id: data.id },
    ]);
  }
}
