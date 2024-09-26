import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CrearCargoComponent } from '../crear-cargo/crear-cargo.component';
import { Cargo } from '../../models/cargo';
import { RiesgosArlService } from '../../../riesgos-arl/service/riesgos-arl.service';
import { lastValueFrom } from 'rxjs';
import { Alert } from 'src/app/helpers/alert_helper';
import { Risk } from '../../../riesgos-arl/models/riesgos';
import { FormatField } from 'src/app/shared/components/models/formatFieldDto';
import { MONEDA } from 'src/app/helpers/constants';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.css'],
})
export class CargoComponent implements OnInit {
  displayedColumns = [
    'name',
    'baseSalary',
    'strComprehensiveSalary',
    'fullRiskARL',
    'acciones',
  ];

  titleColumn = [
    'Nombre',
    'Sueldo base',
    '¿Es integral?',
    'Nivel de riesgo',
    'Acciones',
  ];
  url = 'position';
  title = 'Cargos';
  changeUrl: boolean = false;

  risks: Risk[] = [];
  formatField: FormatField = {
    field: 'Sueldo base',
    format: MONEDA,
  };
  constructor(
    private matDialog: MatDialog,
    private riesgosArlService: RiesgosArlService
  ) {}

  ngOnInit(): void {}

  async openDialog(data?: Cargo) {
    if (this.risks.length > 0) {
      this.dialogResult(data);
    } else {
      try {
        this.risks = await lastValueFrom(this.riesgosArlService.getRisk());
      } catch (error) {
        console.error(error);
        Alert.error(
          'Ha ocurrido un error interno, por favor volverlo a intentar.'
        );
      }

      if (this.risks.length > 0) {
        this.dialogResult(data);
      } else {
        Alert.warning(
          'Por favor registrar primero los riesgos ARL para continuar con cargos.'
        );
      }
    }
  }

  dialogResult(data?: Cargo) {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(CrearCargoComponent, {
      width: '60%',
      data: { risks: this.risks, cargo: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.changeUrl = true;
    });
  }

  dataCreate() {
    this.openDialog();
  }

  dataEdit(data: Cargo) {
    this.openDialog(data);
  }
}
