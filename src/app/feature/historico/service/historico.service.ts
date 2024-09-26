import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ResponseDto } from 'src/app/models/responseDto';
import { environment } from 'src/environments/environment';
import { ConsultHistorical } from '../models/historico';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class HistoricoService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getAllFunctionality(): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/api/HistoricalAction/GetAllFunctionality`,
      options
    );
  }

  getAllUser(): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/api/HistoricalAction/GetAllUser`,
      options
    );
  }

  getHistoricalAudit(consult: ConsultHistorical): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post(
      `${ENDPOINT}/api/HistoricalAction/GetHistoricalAudit`,
      consult,
      options
    );
  }
}
