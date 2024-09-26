import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ProveedoresService } from '../../service/proveedores.service';
import { RegistrarIncrementoComponent } from '../registrar-incremento/registrar-incremento.component';
import { ElementProvider, Providers } from '../../models/proveedores';
import { Elemento } from 'src/app/feature/elementos/models/elementos';
import { ElementosService } from 'src/app/feature/elementos/service/elementos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncrementoComponent } from '../incremento/incremento.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { FormatField } from 'src/app/shared/components/models/formatFieldDto';
import { MONEDA } from 'src/app/helpers/constants';
import { DecimalPipe } from '@angular/common';
import { Alert } from 'src/app/helpers/alert_helper';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-elementos-proveedor',
  templateUrl: './elementos-proveedor.component.html',
  styleUrls: ['./elementos-proveedor.component.css'],
})
export class ElementosProveedorComponent implements OnInit {
  displayedColumns = [
    'check',
    'elementTypeName',
    'code',
    'element',
    'unitPrice',
    'acciones',
  ];
  listTurnos: number;
  changeUrl: boolean = false;
  dataSource!: MatTableDataSource<any>;
  idProvider: any;
  elementoFormGroup: FormGroup;
  elementProvidersList: Providers[] = [];
  elementList: Elemento[] = [];
  ElementProviderList: ElementProvider[] = [];
  listIncrement: Elemento[] = [];
  routeId: string;
  selectAll = false;
  selection = new SelectionModel<Elemento>(true, []);
  nameOfProvider: string

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  formatField: FormatField = {
    field: 'Sueldo base',
    format: MONEDA,
  };
  constructor(
    private _formBuilder: FormBuilder,
    private proveedoresService: ProveedoresService,
    private matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private decimalPipe: DecimalPipe
  ) {
    this.elementoFormGroup = this._formBuilder.group({
      id: 0,
      supplierId: [null, Validators.required],
      supplierName: [''],
      elementTypeId: ['', Validators.required],
      elementTypeName: [''],
      elementId: [''],
      elementName: [''],
      unitPrice: [null],
      observations: [''],
    });
  }

  ngOnInit(): void {
    this.idProvider = this.route.snapshot.paramMap.get('id') ?? 0;
    this.getElementProvider();
    this.getElementProviderByProviderId();
    this.proveedoresService.getProviderName().subscribe(providerName => {
      this.nameOfProvider = providerName;
    });
  }

  formatUnitPrice(unitPrice: number): string {
    return this.decimalPipe.transform(unitPrice, '1.0-0') ?? '';
  }

  getElementProvider(): void {
    this.proveedoresService.getProvider().subscribe((res: Providers[]) => {
      this.elementoFormGroup.value;
      this.elementProvidersList = res;
    });
  }

  getElementProviderByProviderId() {
    this.proveedoresService.getElementProviderByProviderId(this.idProvider).subscribe(
      (res: ElementProvider[]) => {
        this.ElementProviderList = res;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error al obtener elementos del proveedor por ID', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string): void {
    if (this.listIncrement.length > 0) {
      this.changeUrl = false;
      const dialogRef = this.matDialog.open(RegistrarIncrementoComponent, {
        width: '60%',
        data: { title: action, data: this.listIncrement },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.changeUrl = result;
          this.listIncrement = [];
          this.selection.clear();
          this.getElementProviderByProviderId();
          this.selectAll = false;
        }
      });
    } else {
      Alert.warning(
        'No se ha seleccionado información para registrar incremento.'
      );
    }
  }

  showTable(id?: number): void {
    this.changeUrl = false;
    const selectedElement = this.dataSource.data.find(item => item.id === id);
    const dialogRef = this.matDialog.open(IncrementoComponent, {
      width: '60%',
      data: { id, element: selectedElement.elementName},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeUrl = result;
      }
    });
  }

  allCheck(event: any) {
    this.selectAll = event.checked;
    this.dataSource.data.forEach((row) => (row.checked = event.checked));
    if (event.checked) {
      this.listIncrement = this.dataSource.data;
    } else {
      this.listIncrement = [];
    }
  }

  disSelectRow(event: any) {
    const newList = this.listIncrement.filter((item) => item.id !== event.id);
    this.listIncrement = [];
    this.listIncrement = newList;
  }

  selectCheck(event: any) {
    if (event.checked) {
      this.selection.select(event);
      this.listIncrement.push(event);
    } else {
      this.disSelectRow(event);
    }
  }

  goBack() {
    this.router.navigate(['/proveedores']);
  }

  get id() {
    return this.elementoFormGroup.get('id');
  }

  get element() {
    return this.elementoFormGroup.get('elementTypeId');
  }

  get elementName() {
    return this.elementoFormGroup.get('elementName');
  }

  get supplierId() {
    return this.elementoFormGroup.get('supplierId');
  }
}
