import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SalaryBaseConceptsQuotationDto } from '../../catalogos/subcargos/models/elementsProvider';
import { ResponseDto } from 'src/app/models/responseDto';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;
@Injectable({
  providedIn: 'root',
})
export class SalaryBaseConceptsEstimateService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getAllSalaryEstimate(
    subChargesQuotationId: number
  ): Observable<SalaryBaseConceptsQuotationDto[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<SalaryBaseConceptsQuotationDto[]>(
      `${ENDPOINT}/SalaryBaseConceptsEstimate?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  insert(model: SalaryBaseConceptsQuotationDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/SalaryBaseConceptsEstimate`,
      model,
      options
    );
  }

  update(model: SalaryBaseConceptsQuotationDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/SalaryBaseConceptsEstimate`,
      model,
      options
    );
  }

  delete(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/SalaryBaseConceptsEstimate?id=${id}`,
      options
    );
  }
}
