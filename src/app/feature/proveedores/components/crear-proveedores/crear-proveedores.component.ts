import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedoresService } from '../../service/proveedores.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Providers } from '../../models/proveedores';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatStepper } from '@angular/material/stepper';
import { ResponseDto } from 'src/app/models/responseDto';
import { Alert } from 'src/app/helpers/alert_helper';
import { Utiles } from 'src/app/helpers/utiles_helpers';

@Component({
  selector: 'app-crear-proveedores',
  templateUrl: './crear-proveedores.component.html',
  styleUrls: ['./crear-proveedores.component.css'],
})
export class CrearProveedoresComponent implements OnInit, AfterViewInit {
  @ViewChild('nameProvider') nameProvider: ElementRef;
  @ViewChild('stepper') private myStepper: MatStepper;
  providerFormGroup: FormGroup;
  elementoFormGroup: FormGroup;
  action: string | undefined;
  changeTitle: string | undefined;
  titleButton: string;
  routeId: string;
  data: any;
  providerList: Providers[] = [];
  isEditable = false;
  savingProvider: boolean = false;
  updateProvedor: boolean = false;
  providerSave: boolean = false;
  previousStepIndex: number = 0;
  providerId: number;
  providerName: string
  constructor(
    private _formBuilder: FormBuilder,
    private proveedoresService: ProveedoresService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef
  ) {
    this.providerFormGroup = this._formBuilder.group({
      id: 0,
      name: ['', [Validators.required, Validators.maxLength(100)]],
      nit: ['', [Validators.required, Validators.maxLength(20)]],
    });

    this.elementoFormGroup = this._formBuilder.group({});
  }
  ngAfterViewInit(): void {
    this.setFocus();
    this.cd.detectChanges();
  }

  setFocus() {
    this.nameProvider.nativeElement.focus();
  }

  ngOnInit(): void {
    this.routeId = this.route.snapshot.params['id'];
    this.onAction();
    this.getProvider();
    this.getProviderById();

    this.proveedoresService.providerId$.subscribe(id => {
      if (id) {
        this.providerId = id;
        this.providerFormGroup.get('id')?.setValue(this.providerId);
      }
    });
  }

  getProvider() {
    this.proveedoresService.getProvider().subscribe((res) => {
      this.providerList = res;
    });
  }

  getProviderById() {
    if (this.routeId) {
      this.proveedoresService.getProviderById(this.routeId).subscribe(
        (res: any) => {
          this.providerFormGroup.patchValue(res);
        },
        (error) => {
          console.error('Error al obtener proveedor por ID', error);
        }
      );
    }
  }

  saveUpdateProvider(redirectToAdvance: boolean, action: string = '') {
    this.providerFormGroup.markAllAsTouched();
    if (this.providerFormGroup.invalid) {
      return;
    }
    if (!this.routeId) {
      this.saveProvider(redirectToAdvance, action);
    } else {
      this.updateProvider(redirectToAdvance, action);
    }
  }

  saveProvider(goToBack: boolean, action: string = '') {
    if (this.savingProvider) {
      return;
    }
    this.spinner.show();
    this.providerName = this.providerFormGroup.get('name')?.value;
    this.proveedoresService.setProviderName(this.providerName);
    this.savingProvider = true;
    this.proveedoresService.saveProvider(this.providerFormGroup.value).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          if (goToBack) {
            this.goBack();
          } else if (action === 'siguiente') {
            this.providerSave = true;
            this.getProviderById();
            this.myStepper.next();
          }
          this.proveedoresService.notifyProviderId(response.result.id);
        } else {
          Alert.toastSWMessage('warning', response.message);
        }
        this.spinner.hide();
        this.savingProvider = false;
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
        this.savingProvider = false;
        this.myStepper.selectedIndex = 0;
        return;
      },
    });
  }

  updateProvider(goToBack: boolean, action: string = '') {
    if (this.updateProvedor) {
      return;
    }
    this.spinner.show();
    this.providerName = this.providerFormGroup.get('name')?.value;
    this.proveedoresService.setProviderName(this.providerName);
    this.updateProvedor = true;
    this.spinner.show(); this.proveedoresService.updateProvider(this.providerFormGroup.value).subscribe({
      next: (response: ResponseDto) => {
        if (response.isSuccess) {
          Alert.toastSWMessage('success', response.message);
          if (goToBack) {
            this.goBack();
          } else if (action === 'siguiente') {
            this.providerSave = true;
            this.getProviderById();
            this.myStepper.next();
          }
        } else {
          Alert.toastSWMessage('warning', response.message);
        }
        this.spinner.hide();
        this.updateProvedor = false;
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
        this.updateProvedor = false;
        this.myStepper.selectedIndex = 0;
        return;
      },
    });
  }

  onStepChange(event: any) {
    const selectedIndex = event.selectedIndex;
    if (selectedIndex === 1 && event.previouslySelectedIndex === 0) {
      this.saveUpdateProvider(false);
    }
    else if (selectedIndex === 1 && event.previouslySelectedIndex !== 1) {
      this.proveedoresService.notifyProvider(selectedIndex);
    }
    this.previousStepIndex = selectedIndex;
  }

  goBack() {
    this.router.navigate(['/proveedores']);
  }

  onAction(): void {
    this.routeId = this.route.snapshot.params['id'];
    const action = this.route.snapshot.paramMap.get('action');

    if (action === 'editar') {
      this.titleButton = 'Guardar';
      this.changeTitle = 'Editar';
    } else {
      this.titleButton = 'Guardar';
      this.changeTitle = 'Crear';
    }
  }

  get id() {
    return this.providerFormGroup.get('id');
  }

  get name() {
    return this.providerFormGroup.get('name');
  }

  get nit() {
    return this.providerFormGroup.get('nit');
  }

  validateFormatNit(event: any) {
    return Utiles.validateFormatNit(event);
  }
}
