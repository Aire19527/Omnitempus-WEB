import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  AddConceptoBaseSalarialModel,
  ConceptoBaseSalarialModel,
} from '../models/concepto-base-salarial-model';
import { Observable } from 'rxjs';
import { ResponseDto } from 'src/app/models/responseDto';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;
@Injectable({
  providedIn: 'root',
})
export class ConceptoBaseSalarialService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  save(data: AddConceptoBaseSalarialModel): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/SalaryBaseConcepts`,
      data,
      options
    );
  }

  update(data: ConceptoBaseSalarialModel): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/SalaryBaseConcepts`,
      data,
      options
    );
  }

  getAll(): Observable<ConceptoBaseSalarialModel[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ConceptoBaseSalarialModel[]>(
      `${ENDPOINT}/SalaryBaseConcepts`,
      options
    );
  }
  getById(idConcept: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/salaryBaseConcepts/GetById?salaryBaseConceptId=${idConcept}`,
      options
    );
  }
}
