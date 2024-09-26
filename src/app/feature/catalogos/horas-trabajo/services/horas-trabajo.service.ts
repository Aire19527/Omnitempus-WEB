import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TypeOvertimeModel, WorkHours } from '../models/horas-trabajo';
import { ResponseDto } from 'src/app/models/responseDto';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class HorasTrabajoService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getWourHours(): Observable<WorkHours> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<WorkHours>(
      `${ENDPOINT}/OvertimeSurcharges`,
      options
    );
  }

  getWourHoursById(id: string): Observable<WorkHours> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<WorkHours>(
      `${ENDPOINT}/OvertimeSurcharges/GetById?id=${id}`,
      options
    );
  }

  saveWourHours(workHours: WorkHours): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/OvertimeSurcharges`,
      workHours,
      options
    );
  }

  updateWourHours(workHours: WorkHours): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/OvertimeSurcharges`,
      workHours,
      options
    );
  }

  getEnumOverTime(): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/OvertimeSurcharges/enumovertime`,
      options
    );
  }

  getAllTypeOvertime(): Observable<TypeOvertimeModel[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<TypeOvertimeModel[]>(
      `${ENDPOINT}/OvertimeSurcharges/GetAllTypeOvertime`,
      options
    );
  }
}
