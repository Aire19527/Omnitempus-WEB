import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseDto } from 'src/app/models/responseDto';
import { Observable } from 'rxjs';
import { StatesChange } from '../models/cambiar-estado';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class StateChangeService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getStateChange(): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/api/Quotation/GetQuotationStatusList`,
      options
    );
  }

  saveStateChange(statusChange: StatesChange): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/api/Quotation/UpdateQuotationStatus`,
      statusChange,
      options
    );
  }
}
