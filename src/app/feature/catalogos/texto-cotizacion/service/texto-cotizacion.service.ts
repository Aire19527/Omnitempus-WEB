import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDto } from 'src/app/models/responseDto';
import { environment } from 'src/environments/environment';
import {
  AddTextoCotizacionModel,
  TextoCotizacionModel,
} from '../models/textp-cotizacion';
import { AuthService } from 'src/app/core/services/auth.service';
const ENDPOINT = environment.URlServerApi;
@Injectable({
  providedIn: 'root',
})
export class TextoCotizacionService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  save(data: AddTextoCotizacionModel): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/QuoteText`,
      data,
      options
    );
  }

  update(data: TextoCotizacionModel): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/QuoteText`,
      data,
      options
    );
  }

  getAll(): Observable<TextoCotizacionModel[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<TextoCotizacionModel[]>(
      `${ENDPOINT}/QuoteText`,
      options
    );
  }
}
