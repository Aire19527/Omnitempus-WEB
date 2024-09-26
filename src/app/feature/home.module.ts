import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { CoreModule } from '../core/core.module';
import { InicioComponent } from './home/inicio/inicio.component';

@NgModule({
  declarations: [HomeComponent, InicioComponent],
  imports: [CommonModule, CoreModule, HomeRoutingModule],
  exports: [HomeComponent],
})
export class HomeModule {}
