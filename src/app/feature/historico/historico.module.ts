import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricoRoutingModule } from './historico-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HistoricoComponent } from './components/historico/historico.component';
import { FormHistoricoComponent } from './components/form-historico/form-historico.component';
import { JsonToHtmlPipe } from './components/form-historico/jsonToHtml';


@NgModule({
  declarations: [HistoricoComponent, FormHistoricoComponent, JsonToHtmlPipe],
  imports: [CommonModule,SharedModule,HistoricoRoutingModule],
  exports: [HistoricoComponent, FormHistoricoComponent]
})
export class HistoricoModule { }
