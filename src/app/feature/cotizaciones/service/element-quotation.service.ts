import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ElementQuotation } from '../models/elementQuotation';
import { Observable } from 'rxjs';
import { ResponseDto } from 'src/app/models/responseDto';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class ElementQuotationService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getElementQuotation(): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/api/ElementsQuotation`,
      options
    );
  }

  saveElementQuotation(
    elementQuotation: ElementQuotation
  ): Observable<ElementQuotation> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ElementQuotation>(
      `${ENDPOINT}/api/ElementsQuotation`,
      elementQuotation,
      options
    );
  }

  updateElementQuotation(
    elementQuotation: ElementQuotation
  ): Observable<ElementQuotation> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ElementQuotation>(
      `${ENDPOINT}/api/ElementsQuotation`,
      elementQuotation,
      options
    );
  }

  getElementQuotationById(id: string): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/api/ElementsQuotation/GetElementQuotationById?id=${id}`,
      options
    );
  }

  deleteElementQuotation(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/SubChargesElements?id=${id}`,
      options
    );
  }
}
