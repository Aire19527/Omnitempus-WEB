import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  RiskARLQuotationDto,
  UpdateRiskARLQuotationDto,
} from '../../catalogos/subcargos/models/elementsProvider';
import { Observable } from 'rxjs';
import { ResponseDto } from 'src/app/models/responseDto';
import { AuthService } from 'src/app/core/services/auth.service';
const ENDPOINT = environment.URlServerApi;
@Injectable({
  providedIn: 'root',
})
export class RiskARLEstimateService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getAll(subChargesQuotationId: number): Observable<RiskARLQuotationDto[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<RiskARLQuotationDto[]>(
      `${ENDPOINT}/RiskARLEstimate?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  update(model: UpdateRiskARLQuotationDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/RiskARLEstimate`,
      model,
      options
    );
  }
}
