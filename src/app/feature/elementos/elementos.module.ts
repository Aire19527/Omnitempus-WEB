import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElementosRoutingModule } from './elementos-routing.module';
import { FormElementosComponent } from './components/form-elementos/form-elementos.component';
import { ElementosComponent } from './components/elementos/elementos.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [FormElementosComponent, ElementosComponent],
  imports: [CommonModule, ElementosRoutingModule, SharedModule],
})
export class ElementosModule {}
