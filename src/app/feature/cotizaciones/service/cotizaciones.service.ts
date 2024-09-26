import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Cotizaciones,
  QuotationEconomicProposalDto,
  QuotationGetDto,
} from '../models/cotizaciones';
import { ResponseDto } from 'src/app/models/responseDto';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class CotizacionesService {
  namRequest: string = '';
  namOffert: string = '';
  statusName: string = '';
  statusId: number;
  quotationId: number;
  editMode: boolean = false;

  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getQuotation(): Observable<QuotationGetDto[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<QuotationGetDto[]>(
      `${ENDPOINT}/api/Quotation`,
      options
    );
  }

  saveQuotation(cotizaciones: Cotizaciones): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/api/Quotation`,
      cotizaciones,
      options
    );
  }

  updateQuotation(cotizaciones: Cotizaciones): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/api/Quotation`,
      cotizaciones,
      options
    );
  }

  deleteQuotation(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/api/Quotation?id=${id}`,
      options
    );
  }

  getQuotationById(id: string): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/api/Quotation/GetQuotationById?id=${id}`,
      options
    );
  }

  getStatusHistoric(quotationId: number): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/api/QuotationStatusHistoric/GetQuotationStatusHistoric?quotationId=${quotationId}`,
      options
    );
  }

  getRequestsNumber(): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/api/Quotation/GetRequestsNumber`,
      options
    );
  }

  getCostsQuotationParameters(): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/GeneralParameters/GetCostsQuotationParameters`,
      options
    );
  }

  getAllSubChargesQuotationByQuotation(
    quotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/api/Quotation/GetAllSubChargesQuotationByQuotation?quotationId=${quotationId}`,
      options
    );
  }

  private statusNameSubject = new Subject<string>();
  statusName$ = this.statusNameSubject.asObservable();

  private statusIdSubject = new Subject<number>();
  statusId$ = this.statusIdSubject.asObservable();

  private statusSource = new Subject<number>();
  currentStatus$ = this.statusSource.asObservable();

  private namRequestSource = new BehaviorSubject<string>('');
  namRequest$ = this.namRequestSource.asObservable();

  private namOffertSource = new BehaviorSubject<string>('');
  namOffert$ = this.namOffertSource.asObservable();

  setNamRequest(value: string) {
    this.namRequestSource.next(value);
  }

  getNamRequest() {
    return this.namRequest;
  }

  clearNamRequest() {
    this.namRequestSource.next('');
  }

  setNamOffert(value: string) {
    this.namOffertSource.next(value);
  }

  getNamOffert() {
    return this.namOffert;
  }

  clearNamOffert() {
    this.namOffertSource.next('');
  }

  setStatusName(value: string) {
    this.statusName = value;
    this.statusNameSubject.next(value);
  }
  getStatusName() {
    return this.statusName;
  }

  clearStatusName() {
    this.statusName = '';
  }

  setStatusId(value: number) {
    this.statusId = value;
    this.statusIdSubject.next(value);
  }
  getStatusId() {
    return this.statusId;
  }

  setQuotationId(value: number) {
    this.quotationId = value;
  }
  getQuotationId() {
    return this.quotationId;
  }

  setEditMode(value: boolean) {
    this.editMode = value;
  }
  isEditMode(): boolean {
    return this.editMode;
  }

  changeStatus(status: number) {
    this.statusSource.next(status);
  }

  private reloadExtraHourSubject = new Subject();
  reloadExtraHour$ = this.reloadExtraHourSubject.asObservable();
  reloadExtraHour() {
    this.reloadExtraHourSubject.next(true);
  }

  private quotationIdSource = new Subject<number>();

  quotationId$ = this.quotationIdSource.asObservable();

  notifyQuotationId(id: number) {
    this.quotationIdSource.next(id);
  }

  private depreciationSource = new BehaviorSubject<number>(0);
  currentDepreciation = this.depreciationSource.asObservable();

  changeDepreciation(depreciation: number) {
    this.depreciationSource.next(depreciation);
  }

  updateQuotationEconomicProposal(
    cotizacion: QuotationEconomicProposalDto
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/api/Quotation/UpdateQuotationEconomicProposal`,
      cotizacion,
      options
    );
  }

  getQuotationEconomicProposal(idQuotation: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/api/Quotation/GetQuotationEconomicProposal?idQuotation=${idQuotation}`,
      options
    );
  }
}
