import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDto } from 'src/app/models/responseDto';
import { environment } from 'src/environments/environment';
import { AddPolizaModel, PolizaModel } from '../models/poliza';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;
@Injectable({
  providedIn: 'root',
})
export class PolizasService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  save(poliza: AddPolizaModel): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/Policy`,
      poliza,
      options
    );
  }

  update(poliza: PolizaModel): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/Policy`,
      poliza,
      options
    );
  }

  delete(idPoliza: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/Policy?id=${idPoliza}`,
      options
    );
  }

  getAll(): Observable<PolizaModel[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<PolizaModel[]>(`${ENDPOINT}/Policy`, options);
  }
}
