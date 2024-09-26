import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MONEDA, PORCENTAJE } from 'src/app/helpers/constants';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private decimalPipe: DecimalPipe) {}

  //input: 1160000  out: 1,160,000
  //input: 1000.54  out: 1,000.54
  formatearNumero(numero: number, formato: string = '1.2-2'): string {
    try {
    
      const numeroFormateado = this.decimalPipe.transform(numero, formato);
      return numeroFormateado && numeroFormateado.endsWith('.00')
        ? numeroFormateado.slice(0, -3)
        : numeroFormateado || '';
    } catch (error) {
      return numero.toString();
    }
  }

  formatNumberWithoutHyphen(numero: string): string {
    try {
      if (numero.includes('-')) {
        return numero;
      } else {
        return parseInt(numero, 10).toString(); 
      }
    } catch (error) {
      return numero.toString();
    }
  }
  

  validTextOrNumber(value: any, format: string) {
    const isNumber: boolean = !isNaN(parseFloat(value));
    if (isNumber) {
      return this._getValueNumber(this.formatearNumero(value), format);
    } else {
      return value;
    }
  }

  _getValueNumber(value: string, format: string) {
    switch (format.toLowerCase()) {
      case MONEDA: {
        return '$' + value;
      }
      case PORCENTAJE: {
        return value + '%';
      }
      default: {
        return value;
      }
    }
  }
}
