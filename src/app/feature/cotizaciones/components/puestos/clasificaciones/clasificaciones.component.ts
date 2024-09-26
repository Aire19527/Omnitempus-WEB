import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { PrincipalInfoSubChargesQuotationDto } from '../../../models/principalInfoSubChargesQuotationDto';
import { SubcargosService } from 'src/app/feature/catalogos/subcargos/service/subcargos.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseDto } from 'src/app/models/responseDto';
import { CotizacionesService } from '../../../service/cotizaciones.service';

@Component({
  selector: 'app-clasificaciones',
  templateUrl: './clasificaciones.component.html',
  styleUrls: ['./clasificaciones.component.css'],
})
export class ClasificacionesComponent {
  @Input()
  principalInfoSubChargesQuotations: PrincipalInfoSubChargesQuotationDto[];
  @Output() puestoEliminado = new EventEmitter<number>();
  isStatusDisabled: boolean = false;
  statusName: string;
  constructor(
    private subcargosService: SubcargosService,
    private spinner: NgxSpinnerService,
    private cotizacionesService: CotizacionesService,
  ) {}

  ngOnInit(): void {
    this.statusName = this.cotizacionesService.getStatusName();
    this.cotizacionesService.statusName$.subscribe(statusName => {
      this.statusName = statusName;
    });
    this.updateStatusDisabled();
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

  elimimnarPuesto(id: number) {
    Alert.questionConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.subcargosService.deleteSubChargesQuotation(id).subscribe({
          next: (response: ResponseDto) => {
            if (response.isSuccess) {
              Alert.toastSWMessage('success', response.message);
              this.principalInfoSubChargesQuotations =
                this.principalInfoSubChargesQuotations.filter(
                  (x) => x.id != id
                );
              this.puestoEliminado.emit(id);
            } else {
              Alert.toastSWMessage('warning', response.message);
            }
            this.spinner.hide();
          },
          error: (error) => {
            this.spinner.hide();
            Alert.errorHttp(error);
          },
        });
      }
    });
  }
}
