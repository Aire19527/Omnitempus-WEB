import { Component, OnInit } from '@angular/core';
import { Turnos } from '../../models/turnos';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TurnosService } from '../../service/turnos.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css'],
})
export class TurnosComponent {
  displayedColumns = ['name', 'withFestiveFormat', 'acciones'];
  titleColumn = ['Nombre', '¿Con festivo?', 'Acciones'];
  url = 'Shift';
  title = 'Turnos y esquemas';

  changeUrl: boolean = false;
  isInsertOrEditrRoute: boolean = false;
  constructor(private router: Router, private turnosService: TurnosService) {
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
      this.router.navigateByUrl('turnos');
    }
  }

  private updateRoute(): void {
    this.isInsertOrEditrRoute = this.router.url.includes('editar');
    if (!this.isInsertOrEditrRoute) {
      this.isInsertOrEditrRoute = this.router.url.includes('crear');
    }
  }

  dataCreate(): void {
    this.turnosService.turnos = undefined;
    this.router.navigateByUrl('turnos/crear');
  }

  dataEdit(data: Turnos): void {
    this.turnosService.turnos = data;
    this.router.navigate(['turnos/editar']);
    this.router.navigate(['turnos/editar', { id: data.id }]);
  }
}
