import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HorarioPersona } from '../models/esquemas';
import { ResponseDto } from 'src/app/models/responseDto';
import { AuthService } from 'src/app/core/services/auth.service';
import { EsqeuemaHorarioPersona, SchemesEditDto } from '../models/horarios';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class EsquemasService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  generateSchemesByShiftId(shiftId: number): Observable<SchemesEditDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };
    return this._httpClient.get<SchemesEditDto>(
      `${ENDPOINT}/Schemes/GenerateSchemesByShiftId?shiftId=${shiftId}`,
      options
    );
  }

  postSchemes(idShift: number): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };
    const body = { shiftId: idShift };

    return this._httpClient.post<any>(
      `${ENDPOINT}/Schemes?shiftId=${idShift}`,
      body,
      options
    );
  }

  updateSchemesHoursDayPerson(
    hourDayPerson: number,
    idScheme: number
  ): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };
    const body = { schemesId: idScheme, hoursDayPerson: hourDayPerson };

    return this._httpClient.put<any>(
      `${ENDPOINT}/Schemes/UpdateSchemeHoursDayPerson?schemesId=${idScheme}&hoursDayPerson=${hourDayPerson}`,
      body,
      options
    );
  }

  updateSchemeDaysWeekPerson(
    dayWeekPerson: number,
    idScheme: number
  ): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };
    const body = { schemesId: idScheme, daysWeekPerson: dayWeekPerson };

    return this._httpClient.put<any>(
      `${ENDPOINT}/Schemes/UpdateSchemeDaysWeekPerson?schemesId=${idScheme}&daysWeekPerson=${dayWeekPerson}`,
      body,
      options
    );
  }

  updateCalculateRequiredPeople(idScheme: number): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };
    const body = { schemesId: idScheme };

    return this._httpClient.put<any>(
      `${ENDPOINT}/Schemes/CalculateRequiredPeople?schemesId=${idScheme}`,
      body,
      options
    );
  }

  postGenerateRequiredPeople(idShift: number): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<any>(
      `${ENDPOINT}/Schemes/GenerateRequiredPeople?schemeId=${idShift}`,
      { schemeId: idShift },
      options
    );
  }

  getSchemesGetById(schemeId: number): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/Schemes/GetById?schemeId=${schemeId}`,
      options
    );
  }

  generatedSchemes(schemeId: number): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/Schemes/GenerateSchemes?schemeId=${schemeId}`,
      options
    );
  }

  postSchemesWorkSchedulePerson(
    horarioPersona: HorarioPersona[]
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/workSchedulePerson`,
      horarioPersona,
      options
    );
  }

  getSchemesWorkSchedulePerson(schemePersonId: number): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/workSchedulePerson?schemesPersonId=${schemePersonId}`,
      options
    );
  }
}
