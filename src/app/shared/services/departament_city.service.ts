import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDto } from 'src/app/models/responseDto';
import { environment } from 'src/environments/environment';
import {
  DepartamentModel,
  MunicipalityModel,
} from '../models/departament-model';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;
@Injectable({
  providedIn: 'root',
})
export class DepartamentMunicipalityService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getAllDepartaments(): Observable<DepartamentModel[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<DepartamentModel[]>(
      `${ENDPOINT}/department`,
      options
    );
  }

  getAllMunicipalitiesByDepartament(
    code: string
  ): Observable<MunicipalityModel[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<MunicipalityModel[]>(
      `${ENDPOINT}/municipality/GetMunicipalitiesByDepartmentCode?departmentCode=${code}`,
      options
    );
  }
}
