import Swal from 'sweetalert2';

export class Alert {
  static success(message: string) {
    //Swal.fire('Exitoso', message, 'success');
    Swal.fire({
      title: 'Exitoso',
      text: message,
      icon: 'success',
      confirmButtonColor: '#F4A423',
      confirmButtonText: 'Aceptar',
      focusConfirm: true,
    });
  }

  static warning(message: string) {
    //Swal.fire('Alerta', message, 'warning');
    return Swal.fire({
      title: 'Alerta',
      text: message,
      icon: 'warning',
      confirmButtonColor: '#F4A423',
      confirmButtonText: 'Aceptar',
      focusConfirm: true,
    });
  }
  static warningHtml(title: string, message: string) {
    return Swal.fire({
      title: title,
      html: message,
      icon: 'warning',
      confirmButtonColor: '#F4A423',
      confirmButtonText: 'Aceptar',
      focusConfirm: true,
    });
  }
  static error(message: string) {
    //Swal.fire('Error', message, 'error');
    return Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#F4A423',
      confirmButtonText: 'Aceptar',
      focusConfirm: true,
    });
  }

  static toastSWMessage(type: any, message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,

      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: type,
      title: message,
    });
  }

  static errorHttp(error: any) {
    //error business exception
    if (error.status == 400) {
      if (this.isHTML(error.error.message)) {
        return this.warningHtml('Alerta cruce de horario', error.error.message);
      } else {
        return this.warning(error.error.message);
      }
    } else if (error.status === 0) {
      return Swal.fire({
        title: 'Error de conexión',
        text: 'Ha ocurrido un error de red o conexión',
        icon: 'error',
        confirmButtonColor: '#F4A423',
        confirmButtonText: 'Aceptar',
        focusConfirm: true,
      });
    } else {
      //error proveniente de la api
      return this.error(error.error.message);
    }
  }

  static isHTML(str: string): boolean {
    const div = document.createElement('div');
    div.innerHTML = str.trim();

    // Verificamos si hay elementos HTML válidos dentro del div
    return Array.from(div.childNodes).some(
      (node) => node.nodeType === 1 && node instanceof HTMLElement
    );
  }

  static questionConfirmDelete() {
    return Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro de eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F4A423',
      cancelButtonColor: 'rgb(206 206 206)',
      heightAuto: true,

      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      focusCancel: true,
    });
  }
  static questionConfirm(message: string, title: string) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#F4A423',
      cancelButtonColor: 'rgb(206 206 206)',
      heightAuto: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      focusCancel: true,
    });
  }

  static deleteConfirm(message: string) {
    return Swal.fire({
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#F4A423',
      cancelButtonColor: 'rgb(206 206 206)',
      heightAuto: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
    });
  }
}
