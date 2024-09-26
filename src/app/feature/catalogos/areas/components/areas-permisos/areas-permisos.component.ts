import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AreasService } from '../../service/areas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  PermissionInsertModel,
  PermissionModel,
} from '../../models/permission_model';
import { Alert } from 'src/app/helpers/alert_helper';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Areas } from '../../models/areas';
import { Subject, takeUntil } from 'rxjs';
import { SteppersService } from 'src/app/feature/cotizaciones/service/steppers.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-areas-permisos',
  templateUrl: './areas-permisos.component.html',
  styleUrls: ['./areas-permisos.component.css'],
})
export class AreasPermisosComponent implements OnInit, OnDestroy {
  @Input() data?: Areas;
  @ViewChild('stepper') private myStepper: MatStepper;
  permissionForm!: FormGroup;
  permissions: PermissionModel[] = [];
  filteredPermission: PermissionModel[] = [];
  typePermissions: string[] = [];
  savingAreaPermission: boolean = false;

  searchInput = new FormControl('', [Validators.minLength(2)]);
  private ngUnsubscribe = new Subject();

  constructor(
    private areasService: AreasService,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private steppersService: SteppersService,
  ) {
    this.permissionForm = this._formBuilder.group({});
    this.areasService.reloadPermissionAndMenus$.subscribe((result) => {
      this.data = result;
      if (this.data) {
        this.getPermission(this.data.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    if (this.data) {
      this.getPermission(this.data.id);
    }

    // this.steppersService.stepperChangedArea$.subscribe((index) => {
    //   if (index === 1) {
    //     this.savePermission();
    //   }
    // });
  }

  getPermission(idArea: number) {
    this.spinner.show();
    this.areasService.getPermissionArea(idArea).subscribe({
      next: (res) => {
        this.permissions = res.result as PermissionModel[];
        this.filteredPermission = this.permissions;

        this.permissions.forEach((item) => {
          this.permissionForm.addControl(
            item.description,
            this._formBuilder.control(item.isAssigned)
          );
        });

        this.getAmbit();
        this.spinner.hide();
      },
      error: (error) => {
        Alert.errorHttp(error);
        this.spinner.hide();
      },
    });
  }

  getAmbit() {
    this.typePermissions = [
      ...new Set(this.filteredPermission.map((p) => p.typePermission)),
    ];
  }

  onSearch() {
    const searchText = this.searchInput.value;
    this.filteredPermission = this.permissions;
    if (this.searchInput.valid && searchText !== null) {
      this.filteredPermission = this.permissions.filter((p) =>
        p.description.toLowerCase().includes(searchText.toLowerCase())
      );
      this.getAmbit();
    }
  }

  savePermission(action: string = '') {
    if (this.savingAreaPermission) {
      return;
    }

    const idPermissionsArray: number[] = this.permissions
      .filter((p) => this.permissionForm.get(p.description)!.value == true)
      .map((p) => p.idPermission);
    const permissionInsertModel: PermissionInsertModel = {
      idPermissions: idPermissionsArray,
      idArea: this.data?.id!,
    };

    this.spinner.show();
    this.savingAreaPermission = true;
    this.areasService.updatePermissionArea(permissionInsertModel).subscribe({
      next: (res: any) => {

        if (action === 'guardar') {
          this.goBack();
        }
        Alert.toastSWMessage('success', res.message);
        this.spinner.hide();
        this.savingAreaPermission = false;
      },
      error: (error) => {
        Alert.errorHttp(error);
        this.spinner.hide();
        this.savingAreaPermission = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/catalogo/areas']);
    this.savingAreaPermission = false;
  }
}
