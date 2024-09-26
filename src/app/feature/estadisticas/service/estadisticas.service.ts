import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ResponseDto } from 'src/app/models/responseDto';
import { environment } from 'src/environments/environment';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor(private _httpClient: HttpClient, private authService: AuthService) {}


  getDashBoard(startDate: string, endDate: string): Observable<any>{
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(`${ENDPOINT}/Dashboard?startDate=${startDate}&endDate=${endDate}`, options)
  }
}
