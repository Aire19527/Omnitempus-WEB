import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AreasService } from '../../service/areas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Alert } from 'src/app/helpers/alert_helper';
import { MenuDto } from 'src/app/core/menu/models/menu';
import { Areas } from '../../models/areas';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MenuModel, MenuSubMenuModel } from '../../models/menus_model';
import { SteppersService } from 'src/app/feature/cotizaciones/service/steppers.service';
import { MatStepper } from '@angular/material/stepper';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-menus-area',
  templateUrl: './menus-area.component.html',
  styleUrls: ['./menus-area.component.css'],
})
export class MenusAreaComponent implements OnInit {
  @Input() data?: Areas;
  @ViewChild('stepper') private myStepper: MatStepper;
  listMenuItem: MenuDto[] = [];
  menuForm!: FormGroup;
  updateMenuArea: boolean = false;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private areasService: AreasService,
    private _formBuilder: FormBuilder,
    private steppersService: SteppersService,
  ) {
    this.menuForm = this._formBuilder.group({});
    this.areasService.reloadPermissionAndMenus$.subscribe((result) => {
      this.data = result;
      if (this.data) {
        this.getMenus(this.data.id);
      }
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.getMenus(this.data.id);
    }
    this.steppersService.stepperChangedArea$
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((index) => {
      if (index === 2) {
        this.update();
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getMenus(idArea: number) {
    this.spinner.show();
    this.areasService.getMenusArea(idArea).subscribe({
      next: (res) => {
        this.listMenuItem = res.result as MenuDto[];
        this.listMenuItem.forEach((element) => {
          if (element.subMenu.length == 0) {
            this.menuForm.addControl(
              element.name.toString(),
              this._formBuilder.control(element.isAssigned)
            );
          } else {
            element.subMenu?.forEach((sub) => {
              this.menuForm.addControl(
                sub.name.toString(),
                this._formBuilder.control(sub.isAssigned)
              );
            });
          }
        });

        this.spinner.hide();
      },
      error: (error) => {
        Alert.errorHttp(error);
        this.spinner.hide();
      },
    });
  }

  getSelectedMenus(): MenuSubMenuModel[] {
    return this.listMenuItem
      .filter(
        (element) =>
          this.menuForm.controls[element.name]?.value ||
          (element.subMenu &&
            element.subMenu.some(
              (subitem) => this.menuForm.controls[subitem.name]?.value
            ))
      )
      .map((element) => {
        let menu: MenuSubMenuModel = new MenuSubMenuModel();
        menu.menuId = element.idMenu;

        if (element.subMenu) {
          element.subMenu.forEach((item) => {
            if (this.menuForm.controls[item.name]?.value) {
              menu.subMenusId.push(item.idSubMenu);
            }
          });
        }

        return menu;
      });
  }

  update(action: string = '') {
    if (this.updateMenuArea) {
      return;
    }
    const selectedMenusId = this.getSelectedMenus();
    const updateModel: MenuModel = {
      idArea: this.data?.id!,
      idMenus: selectedMenusId,
    };
    this.spinner.show();
    this.updateMenuArea = true;
    this.areasService.updateMenuArea(updateModel).subscribe({
      next: (response) => {

        if (action === 'guardar') {
          this.goBack();
        }
        Alert.toastSWMessage('success', response.message);
        this.spinner.hide();
        this.updateMenuArea = false;
      },
      error: (error) => {
        this.spinner.hide();
        Alert.errorHttp(error);
        this.updateMenuArea = false;
        return;
      },
    });
  }

  goBack() {
    this.router.navigate(['/catalogo/areas']);
    this.updateMenuArea = false;
  }
}
