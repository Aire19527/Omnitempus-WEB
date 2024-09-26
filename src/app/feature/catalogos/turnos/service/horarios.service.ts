import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Horarios } from '../models/horarios';
import { environment } from 'src/environments/environment';
import { ResponseDto } from 'src/app/models/responseDto';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class HorariosService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getShiftDetails(): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(`${ENDPOINT}/shiftDetails`, options);
  }

  getShiftDetailsByShift(idShift: number): Observable<Horarios[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };
    
    return this._httpClient.get<Horarios[]>(
      `${ENDPOINT}/shiftDetails/GetShiftDetailsByShiftId?shiftId=${idShift}`,
      options
    );
  }

  saveShiftDetails(shiftDetails: Horarios[]): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/shiftDetails`,
      shiftDetails,
      options
    );
  }

  upadteShiftDetails(shiftDetails: Horarios[]): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/shiftDetails`,
      shiftDetails,
      options
    );
  }

  deleteShiftDetails(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/shiftDetails?shiftDetailId=${id}`,
      options
    );
  }
}
