import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubcargosService } from 'src/app/feature/catalogos/subcargos/service/subcargos.service';
import { PrincipalInfoSubChargesQuotationDto } from 'src/app/feature/cotizaciones/models/principalInfoSubChargesQuotationDto';

@Component({
  selector: 'app-tipos-elementos',
  templateUrl: './tipos-elementos.component.html',
  styleUrls: ['./tipos-elementos.component.css'],
})
export class TiposElementosComponent {
  @Input()
  principalInfoSubChargesQuotation: PrincipalInfoSubChargesQuotationDto;
}
