import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterGen } from '../models/parametro-gen';
import { environment } from 'src/environments/environment';
import { ResponseDto } from 'src/app/models/responseDto';
import { TarifaServiciosDto } from 'src/app/feature/cotizaciones/models/costos-cotizacion';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class ParametroGenService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  saveParameter(parameterGen: ParameterGen): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/GeneralParameters`,
      parameterGen,
      options
    );
  }

  getParameter(): Observable<ParameterGen[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ParameterGen[]>(
      `${ENDPOINT}/GeneralParameters`,
      options
    );
  }

  updateParameter(parameterGen: ParameterGen): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/GeneralParameters`,
      parameterGen,
      options
    );
  }

  getByParameter(parameterName: string): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/GeneralParameters/GetByParameter?parameter=${parameterName}`,
      options
    );
  }

  getGeneralParametersByType(paramterType: string): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/GeneralParameters/GetGeneralParametersByType?paramterType=${paramterType}`,
      options
    );
  }

  getServiceTariffParameters(): Observable<TarifaServiciosDto[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<TarifaServiciosDto[]>(
      `${ENDPOINT}/GeneralParameters/GetServiceTariffParameters`,
      options
    );
  }
}
