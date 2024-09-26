import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDto } from 'src/app/models/responseDto';
import { environment } from 'src/environments/environment';
import { AddQuotationNoteDto } from '../models/cotizaciones';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;
@Injectable({
  providedIn: 'root',
})
export class QuotationNoteService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getQuoteNotesByQuotationId(quotationId: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/api/QuotationNote/GetQuoteNotesByQuotationId?quotationId=${quotationId}`,
      options
    );
  }

  insert(add: AddQuotationNoteDto): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/api/QuotationNote/Insert`,
      add,
      options
    );
  }

  delete(idQuotationNote: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/api/QuotationNote/Delete?idQuotationNote=${idQuotationNote}`,
      options
    );
  }
}
