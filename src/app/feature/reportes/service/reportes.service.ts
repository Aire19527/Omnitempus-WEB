import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDto } from 'src/app/models/responseDto';
import { environment } from 'src/environments/environment';
import {
  ConsultReport,
  ElementQuotation,
  ReporteModel,
  SalaryQuotation,
  TraceabilityQuotation,
} from '../models/reportes';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  ReportParamter: ReporteModel = {
    idReport: 0,
    parameters: {},
    nameFile: '',
  };

  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getSalaryQuotation() {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(`${ENDPOINT}/api/Quotation`, options);
  }

  generateSalaryQuotation(cotizaciones: SalaryQuotation) {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/api/Quotation`,
      cotizaciones,
      options
    );
  }

  generateElementQuotation(cotizaciones: ElementQuotation) {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/api/Quotation`,
      cotizaciones,
      options
    );
  }

  generateTraceabilityQuotation(cotizaciones: TraceabilityQuotation) {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/api/Quotation`,
      cotizaciones,
      options
    );
  }

  viewReport(report: ConsultReport): Observable<string> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers, responseType: 'text' as 'json' };

    return this._httpClient.post<string>(
      `${ENDPOINT}/Report/ViewReport`,
      report,
      options
    );
  }

  exportReport(report: ConsultReport): Observable<Blob> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers, responseType: 'blob' as 'json' }; // Nota el uso de 'blob' as 'json'

    return this._httpClient.post<Blob>(
      `${ENDPOINT}/Report/ExportReport`,
      report,
      options
    );
  }

  // getReport(idReport: number): Observable<ResponseDto> {
  //   const userToken = `Bearer ${this.authService.readToken()}`;
  //   const headers = new HttpHeaders({ Authorization: userToken });
  //   const options = { headers: headers };

  //   return this._httpClient.get<ResponseDto>(
  //     `${ENDPOINT}/Report/GetReportById?idReport=${idReport}`,
  //     options
  //   );
  // }
}
