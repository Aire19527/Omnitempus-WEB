import { Component } from '@angular/core';
import { ProveedoresService } from '../../service/proveedores.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Alert } from 'src/app/helpers/alert_helper';
import { ResponseDto } from 'src/app/models/responseDto';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-incremento-archivo',
  templateUrl: './incremento-archivo.component.html',
  styleUrls: ['./incremento-archivo.component.css'],
})
export class IncrementoArchivoComponent {
  isInsertOrEditrRoute: boolean = false;
  title = 'Subir archivo';
  selectedFile: File | null = null;
  FormGroup: FormGroup;

  constructor(
    private router: Router,
    private proveedoresService: ProveedoresService,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRoute();
      });

    this.FormGroup = this._formBuilder.group({
      file: [''],
    });
  }

  private updateRoute(): void {
    this.isInsertOrEditrRoute = this.router.url.includes('editar');
    if (!this.isInsertOrEditrRoute) {
      this.isInsertOrEditrRoute = this.router.url.includes('crear');
    }
  }
  ngOnInit(): void {
    this.spinner.hide();
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  base64ToArrayBuffer(base64: any): ArrayBuffer {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  uploadFile(data: any): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.spinner.show();
      this.proveedoresService
        .updateElementProviderIncrementElementsBacth(formData)
        .subscribe({
          next: (response: any) => {
            if (response) {
              var content = this.base64ToArrayBuffer(response);
              var blob = new Blob([content], { type: this.selectedFile?.type });
              var name = this.selectedFile?.name.split('.')[0];
              var extension = this.selectedFile?.name.split('.')[1];
              saveAs(blob, name + '_Resultado' + '.' + extension);
            } else {
              Alert.toastSWMessage('warning', response.message);
            }
            this.selectedFile = null;
            this.spinner.hide();
          },
          error: (error) => {
            this.selectedFile = null;
            this.spinner.hide();
            if (error && error.message) {
              let message = error.error.message;
              if (error && error.error.result) {
                const errorMessages = error.error.result;
                errorMessages.forEach((errorMessage: string) => {
                  message += '<br>' + errorMessage + '</br>';
                });

                Swal.fire({
                  title: 'Error',
                  html: message,
                  icon: 'error',
                  confirmButtonColor: '#F4A423',
                  confirmButtonText: 'Aceptar',
                  focusConfirm: true,
                });
              } else {
                Alert.errorHttp(error);
              }
            }
            return;
          },
        });
    } else {
      Alert.warning(
        'Para aplicar el incremento debes de seleccionar un archivo'
      );
    }
  }
}
