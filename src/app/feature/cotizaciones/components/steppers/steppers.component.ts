import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CotizacionesService } from '../../service/cotizaciones.service';
import { CambiarEstadoComponent } from '../puestos/cambiar-estado/cambiar-estado.component';
import { MatDialog } from '@angular/material/dialog';
import { StatesChange } from '../../models/cambiar-estado';
import { Subscription } from 'rxjs';
import { SteppersService } from '../../service/steppers.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Alert } from 'src/app/helpers/alert_helper';
import { HistoricoEstadoComponent } from '../puestos/historico-estado/historico-estado.component';

@Component({
  selector: 'app-steppers',
  templateUrl: './steppers.component.html',
  styleUrls: ['./steppers.component.css'],
})
export class SteppersComponent implements OnInit {
  showStepperPropuesta: boolean = false;
  namRequest: string;
  namOffert: string;
  changeUrl: boolean = false;
  statusName: string;
  statusNameSubscription: Subscription;
  areaCostoFormGroup: FormGroup;
  puestosFormGroup: FormGroup;
  propuestaForm: FormGroup;
  isEditable = true;
  isLinear = false;
  routeId: string;


  constructor(private _formBuilder: FormBuilder, private matDialog: MatDialog, private cotizacionesService: CotizacionesService, private steppersService: SteppersService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) {
    this.areaCostoFormGroup = this._formBuilder.group({});
    this.puestosFormGroup = this._formBuilder.group({
      cargo: [''],
      subCargo: [''],
      departmentCode: [''],
      municipalityCode: [''],
    });
    this.propuestaForm = this._formBuilder.group({});
  }

  ngOnInit(): void {
    this.routeId = this.route.snapshot.params['id'];

    this.statusName = this.cotizacionesService.getStatusName();
    this.showStepperPropuesta = this.cotizacionesService.isEditMode();
    this.isEditable = this.showStepperPropuesta;

    this.cotizacionesService.statusName$.subscribe((statusName) => {
      this.statusName = statusName;
    });
    
    this.namRequest = this.cotizacionesService.getNamOffert();
    this.cotizacionesService.namRequest$.subscribe((namRequest) => {
      this.namRequest = namRequest;
    });

    this.cotizacionesService.namOffert$.subscribe((namOffert) => {
      this.namOffert = namOffert;
    });


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/cotizaciones') {
        this.cotizacionesService.clearNamRequest();
        this.cotizacionesService.clearStatusName();
        this.cotizacionesService.clearNamOffert();
      }
    });

    this.getNumberEdit();
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }


  getNumberEdit(): void {
    this.routeId = this.route.snapshot.params['id'];
    if (this.routeId) {
      this.areaCostoFormGroup.statusChanges.subscribe(
        (event) => (this.isLinear = !this.areaCostoFormGroup.valid)
      );
    } else {
      this.isLinear = true;
    }
  }


  onSelectionChange(event: any) {
    const selectedIndex = event.selectedIndex
    if (this.areaCostoFormGroup?.invalid) {
      this.isLinear = false;
    } else {
      this.isLinear = true;
    }

    if (selectedIndex === 1 && event.previouslySelectedIndex === 0) {
        this.steppersService.stepperChangedArea(1);
    } else if(selectedIndex === 2 && event.previouslySelectedIndex === 0){

      if(this.inValidStatus()){
        Alert.warning('En caso de haber modificado información básica, pólizas y/o elementos, se debe recalcular los costos para cada uno de los puestos').then(() => {
          this.steppersService.stepperChangedArea(2);
        });
      }
    }else if (selectedIndex === 2 && event.previouslySelectedIndex !== 2) {
      this.steppersService.stepperChangedArea(selectedIndex);
      this.puestosFormGroup.get('cargo')?.clearValidators();
      this.puestosFormGroup.get('subCargo')?.clearValidators();
      this.puestosFormGroup.get('departmentCode')?.clearValidators();
      this.puestosFormGroup.get('municipalityCode')?.clearValidators();

      this.puestosFormGroup.updateValueAndValidity();
    } 
    if (
      event.selectedIndex === 0 ||
      event.selectedIndex === 1 ||
      event.selectedIndex === 2
    ) {
      this.showStepperPropuesta = true;
    } else {
      this.showStepperPropuesta = false;
    }
  }

  inValidStatus(): boolean {
    return !(this.statusName === 'Aprobada' 
    || this.statusName === 'No Aprobada' 
    || this.statusName === 'Reemplazada' 
    || this.statusName === 'Anulada' 
    || this.statusName === 'Enviada al Cliente' 
    || this.statusName === 'Enviada al Solicitante');
  }


  openDialogStatusChange(action: string, data?: StatesChange): void {
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(CambiarEstadoComponent, {
      width: '60%',
      data: { title: action, data: data },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.changeUrl = result;
        this.statusName = result.newStatusName;
      }
    });

  }

  openDialogStatusHistoric(){
    this.changeUrl = false;
    const dialogRef = this.matDialog.open(HistoricoEstadoComponent, {
      width: '90%',
      data: {quoationId: this.routeId}
    });
    dialogRef.afterClosed().subscribe( () => {

    }) 
  }

  statusChange() {
    this.openDialogStatusChange('crear');
  }

  statusHistoric(){
    this.openDialogStatusHistoric();
  }
}
