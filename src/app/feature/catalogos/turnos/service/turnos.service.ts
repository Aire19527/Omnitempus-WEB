import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddShiftQuotatioDto, Turnos } from '../models/turnos';
import { ResponseDto } from 'src/app/models/responseDto';
import { ExtraHoursDto } from '../../subcargos/models/elementsProvider';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  turnos?: Turnos;
  getTurnos(): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(`${ENDPOINT}/Shift`, options);
  }

  getTurnosById(id: string): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/Shift/GetById?shiftId=${id}`,
      options
    );
  }

  saveTurnos(turnos: Turnos): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/Shift`,
      turnos,
      options
    );
  }

  updateTurnos(turnos: Turnos): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/Shift`,
      turnos,
      options
    );
  }

  deleteTurnos(id: string): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<any>(`${ENDPOINT}/Shift?id=${id}`, options);
  }

  getAllShiftQuotationBySubChargesQuotation(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/Shift/GetAllShiftQuotationBySubChargesQuotation?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  addShiftQuotation(add: AddShiftQuotatioDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/Shift/AddShiftQuotation`,
      add,
      options
    );
  }

  getExtraHoursByShift(subChargesQuotationId: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/Shift/GetExtraHoursByShift?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  GetShiftId(subChargesQuotationId: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/Shift/GetShiftId?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  GetAllExtraHoursBySubChargesQuotation(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/Shift/GetAllExtraHoursBySubChargesQuotation?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }
}
