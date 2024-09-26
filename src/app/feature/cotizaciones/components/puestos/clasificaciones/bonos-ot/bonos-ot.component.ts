import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom } from 'rxjs';
import { ParameterGen } from 'src/app/feature/catalogos/parametros-gen/models/parametro-gen';
import { ParametroGenService } from 'src/app/feature/catalogos/parametros-gen/service/parametro-gen.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { CrearEditarBonoOTComponent } from './crear-editar-bono-ot/crear-editar-bono-ot.component';
import { PARAMETROS_BIENESTAR } from 'src/app/helpers/constants';
import { ElementypeElementService } from 'src/app/feature/cotizaciones/service/elementype-element.service';
import { ResponseDto } from 'src/app/models/responseDto';
import { BonosOT } from 'src/app/feature/cotizaciones/models/bonos-ot';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CotizacionesService } from 'src/app/feature/cotizaciones/service/cotizaciones.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-bonos-ot',
  templateUrl: './bonos-ot.component.html',
  styleUrls: ['./bonos-ot.component.css'],
})
export class BonosOTComponent implements OnInit, AfterViewInit {
  @Input() subChargesQuotationId: number;
  @Input() listBonosOT: BonosOT[];

  displayedColumns: string[] = [
    'generalParameterName',
    'cost',
    'depreciation',
    'quantity',
    'acciones',
  ];
  dataSource: MatTableDataSource<BonosOT> = new MatTableDataSource<BonosOT>();
  bonosOTs: BonosOT[] = [];
  parameters: ParameterGen[] = [];
  statusName: string;
  isStatusDisabled: boolean = false;
  depreciation: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private parametroGenService: ParametroGenService,
    private elementypeElementService: ElementypeElementService,
    private matDialog: MatDialog,
    private spinner: NgxSpinnerService,
    private cotizacionesService: CotizacionesService
  ) {}

  ngOnInit(): void {
    this.dataSource.data = this.listBonosOT;
    this.statusName = this.cotizacionesService.getStatusName();
    this.updateStatusDisabled();

    this.cotizacionesService.currentDepreciation.subscribe((depreciation) => {
      this.depreciation = depreciation;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  updateStatusDisabled() {
    if (
      this.statusName === 'Enviada al Solicitante' ||
      this.statusName === 'Enviada al Cliente' ||
      this.statusName === 'Aprobada' ||
      this.statusName === 'Reemplazada' ||
      this.statusName === 'No Aprobada' ||
      this.statusName === 'Anulada'
    ) {
      this.isStatusDisabled = true;
    } else {
      this.isStatusDisabled = false;
    }
  }

  async openDialog(element?: BonosOT) {
    if (this.parameters.length > 0) {
      this.dialogResult(element);
    } else {
      try {
        this.spinner.show();
        const response = await lastValueFrom(
          this.parametroGenService.getGeneralParametersByType(
            PARAMETROS_BIENESTAR
          )
        );
        this.parameters = response.result as ParameterGen[];

        this.spinner.hide();
      } catch (error) {
        this.spinner.hide();
        console.error(error);
        Alert.error(
          'Ha ocurrido un error interno, por favor volverlo a intentar.'
        );
      }

      if (this.parameters.length > 0) {
        this.dialogResult(element);
      } else {
        Alert.warning('No se encontraron los parametros para bonos OT');
      }
    }
  }

  dialogResult(element?: BonosOT) {
    const dialogRef = this.matDialog.open(CrearEditarBonoOTComponent, {
      width: '60%',
      data: {
        parameters: this.parameters,
        element: element,
        subChargesQuotationId: this.subChargesQuotationId,
        depreciation: this.depreciation,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAll();
      }
    });
  }

  edit(model: BonosOT) {
    this.openDialog(model);
  }

  delete(model: BonosOT) {
    Alert.questionConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.deleteBonusOT(model.id);
      }
    });
  }

  getAll() {
    this.spinner.show();
    this.elementypeElementService
      .getAllBonusOTByQuotationId(this.subChargesQuotationId)
      .subscribe({
        next: (response: ResponseDto) => {
          this.bonosOTs = response.result as BonosOT[];
          this.dataSource.data = this.bonosOTs;
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
  }

  deleteBonusOT(id: number) {
    this.spinner.show();
    this.elementypeElementService.deleteBonusOT(id).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          this.getAll();
        } else {
          Alert.toastSWMessage('warning', response.message);
        }
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        console.error(error);
        Alert.errorHttp(error);
      },
    });
  }
}
