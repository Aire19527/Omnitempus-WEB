import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AreasService } from '../../service/areas.service';
import { AddAreas, Areas } from '../../models/areas';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { SteppersService } from 'src/app/feature/cotizaciones/service/steppers.service';

@Component({
  selector: 'app-areas-crear-edit',
  templateUrl: './areas-crear-edit.component.html',
  styleUrls: ['./areas-crear-edit.component.css'],
})
export class AreasCrearEditComponent implements OnInit, AfterViewInit {
  @ViewChild('name') name: ElementRef;
  areasFormGroup: FormGroup;
  menuForm: FormGroup;
  permissionForm: FormGroup;
  data: Areas;
  idArea: number;
  previousStepIndex: number = 0;
  savingArea: boolean = false;
  updateArea: boolean = false;
  routeId: string;
  isEditable = true;
  isLinear = false;

  @ViewChild('stepper') private myStepper: MatStepper;
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private areasService: AreasService,
    private spinner: NgxSpinnerService,
    private location: Location,
    private cd: ChangeDetectorRef,
    private steppersService: SteppersService
  ) {
    this.areasFormGroup = this._formBuilder.group({
      id: 0,
      name: ['', [Validators.required, Validators.maxLength(100)]],
      groupId: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
    });

    this.menuForm = this._formBuilder.group({});

    this.permissionForm = this._formBuilder.group({});

    try {
      const navigation = this.router.getCurrentNavigation();
      const objeto = navigation?.extras.state as { data: Areas };
      this.data = objeto.data;
      this.idArea = this.data.id;
      this.areasFormGroup.patchValue(this.data);
    } catch {
      console.warn('recarga sin ruta');
    }
  }

  ngOnInit() {
    if (this.idArea) {
      this.areasFormGroup.statusChanges.subscribe(
        (event) => (this.isLinear = !this.areasFormGroup.valid)
      );
    } else {
      this.isLinear = true;
    }
  }

  ngAfterViewInit(): void {
    this.setFocus();
    this.cd.detectChanges();
  }

  setFocus() {
    this.name.nativeElement.focus();
  }

  saveUpdateArea(goToBack: boolean, action = '') {
    this.areasFormGroup.markAllAsTouched();
    if (this.areasFormGroup.invalid) {
      return;
    }
    const id = this.areasFormGroup.get('id')?.value;
    if (id === 0) {
      this.insert(goToBack, action);
    } else {
      this.update(goToBack, action);
    }
  }

  insert(goToBack: boolean, action: string = '') {
    if (this.savingArea) {
      return;
    }

    const add: Areas = {
      name: this.areasFormGroup.get('name')?.value,
      groupId: this.areasFormGroup.get('groupId')?.value,
      description: this.areasFormGroup.get('description')?.value,
      id: this.areasFormGroup.get('id')?.value,
    };
    this.spinner.show();
    this.savingArea = true;
    this.areasService.saveArea(add).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          this.data = {
            name: add.name,
            groupId: add.groupId,
            description: add.description,
            id: response.result,
          };
          if (goToBack) {
            this.goBack();
          } else if (action === 'siguiente') {
            this.myStepper.next();
          }
          this.areasService.reloadPermissionAndMenus(this.data);
          this.areasFormGroup.get('id')?.setValue(response.result);
        } else {
          Alert.toastSWMessage('warning', response.message);
        }
        this.spinner.hide();
        this.savingArea = false;
      },
      error: (error) => {
        this.savingArea = false;
        Alert.errorHttp(error);
        this.spinner.hide();
        this.myStepper.selectedIndex = 0;
      },
    });
  }

  update(goToBack: boolean, action: string = '') {
    if (this.updateArea) {
      return;
    }

    const update: Areas = {
      name: this.areasFormGroup.get('name')?.value,
      groupId: this.areasFormGroup.get('groupId')?.value,
      description: this.areasFormGroup.get('description')?.value,
      id: this.data.id,
    };
    this.data.name = update.name;
    this.data.description = update.description;
    this.spinner.show();
    this.updateArea = true;

    this.areasService.updateArea(update).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          if (goToBack) {
            this.goBack();
          } else if (action === 'siguiente') {
            this.myStepper.next();
          }
          this.areasService.reloadPermissionAndMenus(this.data);
        } else {
          Alert.toastSWMessage('warning', response.message);
        }
        this.spinner.hide();
        this.updateArea = false;
      },
      error: (error) => {
        this.updateArea = false;
        Alert.errorHttp(error);
        this.spinner.hide();
        this.myStepper.selectedIndex = 0;
        return;
      },
    });
  }

  onSelectionChange(event: any) {
    const selectedIndex = event.selectedIndex;
    if (selectedIndex === 1 && event.previouslySelectedIndex === 0) {
      this.saveUpdateArea(false);
    } else if (selectedIndex === 2 && event.previouslySelectedIndex === 1) {
      this.steppersService.stepperChangedArea(selectedIndex);
    } else if (selectedIndex === 1 && event.previouslySelectedIndex === 2) {
      this.steppersService.stepperChangedArea(selectedIndex);
    } else if (selectedIndex === 2 && event.previouslySelectedIndex === 0) {
      this.saveUpdateArea(false);
    }

    this.previousStepIndex = selectedIndex;
  }

  goBack() {
    this.location.back();
  }

  get groupId() {
    return this.areasFormGroup.get('groupId');
  }
}
