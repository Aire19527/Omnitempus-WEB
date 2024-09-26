import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Element, ElementoType } from '../../models/elemento';
import { ElementoService } from '../../service/elemento.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-elemento-crear-editar',
  templateUrl: './elemento-crear-editar.component.html',
  styleUrls: ['./elemento-crear-editar.component.css'],
})
export class ElementoCrearEditarComponent implements OnInit {
  action: string | undefined;
  formElement: FormGroup;
  elementEnumList: string[] = [];
  titleButton: string;
  elementTypeList: ElementoType[] = [];
  elementList: Element[] = [];
  elementListCopy: Element[] = [];
  routeId: string;

  constructor(
    public dialogRef: MatDialogRef<ElementoCrearEditarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private elementoService: ElementoService,
    private spinner: NgxSpinnerService
  ) {
    this.action = data.title;

    this.formElement = this._formBuilder.group({
      id: 0,
      name: ['', [Validators.required, Validators.maxLength(300)]],
      classificationId: [0, Validators.required],
      classificationName: [''],
      typeElement: ['', Validators.required],
      distributionType: null,
      description: ['', Validators.maxLength(500)],
      code: ['', Validators.maxLength(10)],
      isRelationShip: ['', Validators.required],
      elementRelationId: [['']],
    });
  }

  ngOnInit(): void {
    this.onAction();
    this.setData();
    this.getElementType();
    this.getElement();
    this.typeElementChanges();
  }

  setData() {
    if (this.data.data) {
      this.getElementType();
      this.getElement();
      this.formElement.patchValue(this.data.data);

      const elementRelationId = this.data.data.elementRelationId;
      const parsedElementRelationId =
        this.parseElementRelationId(elementRelationId);
      this.formElement
        .get('elementRelationId')
        ?.setValue(parsedElementRelationId);
    }
  }

  parseElementRelationId(elementRelationId: string): number[] {
    try {
      return JSON.parse(elementRelationId);
    } catch (error) {
      console.error('Error al analizar elementRelationId:', error);
      return [];
    }
  }

  typeElementChanges() {
    this.formElement.get('typeElement')?.valueChanges.subscribe((value) => {
      const codeControl = this.formElement.get('code');
      if (value === 'Servicio') {
        codeControl?.clearValidators();
      } else {
        codeControl?.setValidators([
          Validators.required,
          Validators.maxLength(10),
        ]);
      }
      codeControl?.updateValueAndValidity();
    });
  }

  getElementType() {
    this.elementoService.getElementType().subscribe((res: ElementoType[]) => {
      this.elementTypeList = res.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
  }

  getElement() {
    this.elementoService.getElement().subscribe((res: Element[]) => {
      this.elementListCopy = res;

      this.action == 'editar' &&
        this.filterElementList(this.formElement.get('classificationId')?.value);
    });
  }

  onClassificationChange($event: any) {
    this.filterElementList($event.value);
  }

  filterElementList(classificationId: number) {
    this.elementList = this.elementListCopy.filter(
      (e) => e.classificationId == classificationId
    );
  }

  saveUpdateElemento() {
    this.formElement.markAllAsTouched();
    if (this.formElement.invalid) {
      return;
    }
    const relation = this.formElement.get('elementRelationId')?.value;
    const data = this.formElement.value;
    data.elementRelationId = JSON.stringify(relation);
    if (this.action === 'crear') {
      this.spinner.show();      
      this.elementoService.saveElement(data).subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
          } else {
            Alert.toastSWMessage('warning', response.message);
          }
          this.close(true);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
    } else if (this.action === 'editar') {
      this.spinner.show();
      this.elementoService.updateElement(data).subscribe({
        next: (response: ResponseDto) => {
          if (response.isSuccess) {
            Alert.toastSWMessage('success', response.message);
          } else {
            Alert.toastSWMessage('warning', response.message);
          }
          this.close(true);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Alert.errorHttp(error);
        },
      });
    }
  }

  close(isEdit: boolean) {
    this.dialogRef.close(isEdit);
  }

  closeModal() {
    this.dialogRef.close();
  }

  onAction(): void {
    if (this.action === 'crear') {
      this.titleButton = 'Guardar';
    } else if (this.action === 'editar') {
      this.titleButton = 'Guardar';
    }
  }

  get code() {
    return this.formElement.get('code');
  }
  get name() {
    return this.formElement.get('name');
  }

  get elementRelationId() {
    return this.formElement.get('elementRelationId');
  }

  get classificationId() {
    return this.formElement.get('classificationId');
  }
}
