import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Subchanger,
  ElementByProvider,
  ConsultSubchanger,
  AddSubChanger,
  AddElementQuotationDto,
} from '../models/subcargos';
import { ResponseDto } from 'src/app/models/responseDto';
import { ElementProvider } from '../models/subchargueElementType';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class SubcargosService {
  private stepChangeSubject = new Subject<number>();
  private subchargerIdSource = new Subject<number>();
  private SubchargerSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  private positionSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  stepChange$ = this.stepChangeSubject.asObservable();
  subchargerId$ = this.subchargerIdSource.asObservable();
  position: string;
  SubCharge: string;

  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  // Subcargo
  getSubcharge(): Observable<ConsultSubchanger[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ConsultSubchanger[]>(
      `${ENDPOINT}/SubCharges`,
      options
    );
  }

  saveSubcharge(subchanger: AddSubChanger): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/SubCharges`,
      subchanger,
      options
    );
  }

  updateSubcharge(subchanger: Subchanger): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/SubCharges`,
      subchanger,
      options
    );
  }

  getSubChargesElements(): Observable<ElementByProvider[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ElementByProvider[]>(
      `${ENDPOINT}/SubChargesElements`,
      options
    );
  }

  saveSubChargesElements(
    elementByProvider: ElementByProvider
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/SubChargesElements`,
      elementByProvider,
      options
    );
  }

  updateSubChargesElements(
    elementByProvider: ElementByProvider
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/SubChargesElements`,
      elementByProvider,
      options
    );
  }

  getElementByProvider(elementTypeId: number): Observable<ElementProvider[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ElementProvider[]>(
      `${ENDPOINT}/elementProvider/GetElementProviderByElementTypeId?elementTypeId=${elementTypeId}`,
      options
    );
  }

  getElementProviderByElementTypeIdWeapons(
    subChargesQuotationId: number,
    elementTypeId: number
  ): Observable<ElementProvider[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ElementProvider[]>(
      `${ENDPOINT}/elementProvider/GetElementProviderByElementTypeIdWeapons?subChargesQuotationId=${subChargesQuotationId}&elementTypeId=${elementTypeId}`,
      options
    );
  }

  getElementProviderByElementTypeIdVehicles(
    subChargesQuotationId: number,
    elementTypeId: number
  ): Observable<ElementProvider[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ElementProvider[]>(
      `${ENDPOINT}/elementProvider/GetElementProviderByElementTypeIdVehicles?subChargesQuotationId=${subChargesQuotationId}&elementTypeId=${elementTypeId}`,
      options
    );
  }

  getEnumLiquidation(): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(`${ENDPOINT}/element/myenum`, options);
  }

  getSubchargesElementsById(id: number): Observable<any[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/SubChargesElements/GetById?id=${id}`,
      options
    );
  }

  getSubchargesElementsByIdSubcharges(id: number): Observable<any[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/SubChargesElements/GetSubChargesElementsBySubCharges?subchargesId=${id}`,
      options
    );
  }

  getSubChargesByPosition(idCargo: number): Observable<Subchanger[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<Subchanger[]>(
      `${ENDPOINT}/SubCharges/GetSubChargesByPosition?positionId=${idCargo}`,
      options
    );
  }

  getSubchargesElementsByIdElements(id: number): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/SubChargesElements/GetSubChargesElementsByElement?elementId=${id}`,
      options
    );
  }

  getSubchargeElements(): Observable<any[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any[]>(
      `${ENDPOINT}/SubChargesElements`,
      options
    );
  }

  deleteSubchargeElements(id: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/SubChargesElements?id=${id}`,
      options
    );
  }

  getSubChargesElementProviderBySubChargerId(
    subchargeId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/SubChargesElements/GetSubChargesElementProviderBySubChargerId?subchargeId=${subchargeId}`,
      options
    );
  }

  addSubChargesByPositionQuotation(
    add: AddElementQuotationDto
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/SubCharges/AddSubChargesByPositionQuotation`,
      add,
      options
    );
  }

  calculateQuotationValues(
    quotationId: number,
    subchargesId: number,
    municipalityCode: string
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/SubCharges/CalculateQuotationValues?quotationId=${quotationId}&subchargesId=${subchargesId}&municipalityCode=${municipalityCode}`,
      options
    );
  }

  calculateMonthlyTariff(totalCosts: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/SubCharges/calculateMonthlyTariff?totalCosts=${totalCosts}`,
      options
    );
  }

  minimumTariff(
    subChargeQuatationId: number,
    serviceTariffPercentage: number,
    costMonthlyService: number,
    serviceTariffId: number,
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/SubCharges/MinimumTariff?subChargeQuatationId=${subChargeQuatationId}&serviceTariffPercentage=${serviceTariffPercentage}&costMonthlyService=${costMonthlyService}&serviceTariffId=${serviceTariffId}`,
      options
    );
  }

  calculateObjectiveValue(
    subChargeQuatationId: number,
    objectiveValue: number,
    monthlyTariff: string,
    totalCosts: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/SubCharges/CalculateObjectiveValue?subChargeQuatationId=${subChargeQuatationId}&objectiveValue=${objectiveValue}&monthlyTariff=${monthlyTariff}&totalCosts=${totalCosts}`,
      options
    );
  }

  calculateServiceWithIVA(
    subChargeQuatationId: number,
    ivaType: number,
    serviceMonthlyTariff: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/SubCharges/CalculateServiceWithIVA?subChargeQuatationId=${subChargeQuatationId}&ivaType=${ivaType}&serviceMonthlyTariff=${serviceMonthlyTariff}`,
      options
    );
  }

  deleteSubChargesQuotation(
    subChargesQuotationId: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.delete<ResponseDto>(
      `${ENDPOINT}/SubCharges/DeleteSubChargesQuotation?subChargesQuotationId=${subChargesQuotationId}`,
      options
    );
  }

  setPositionName(position: string) {
    this.position = position;
  }
  getPositionName(): string {
    return this.position;
  }

  setSubChargeName(SubCharge: string) {
    this.SubCharge = SubCharge;
  }
  getSubChargeName(): string {
    return this.SubCharge;
  }

  notifySubCharge(step: number) {
    this.stepChangeSubject.next(step);
  }

  notifysubchargerId(id: number) {
    this.subchargerIdSource.next(id);
  }

  setSubcharger(SubchargerName: string): void {
    this.SubchargerSubject.next(SubchargerName);
  }

  getSubcharger(): Observable<string> {
    return this.SubchargerSubject.asObservable();
  }

  setPosition(positionName: string): void {
    this.positionSubject.next(positionName);
  }

  getPosition(): Observable<string> {
    return this.positionSubject.asObservable();
  }
}
