import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IncrementElements, Providers } from '../models/proveedores';
import { ResponseDto } from 'src/app/models/responseDto';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  private stepChangeSubject = new Subject<number>();
  private providerIdSource = new Subject<number>();
  private providerNameSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  private elementNameSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  stepChange$ = this.stepChangeSubject.asObservable();
  providerId$ = this.providerIdSource.asObservable();
  provider: string;

  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getProvider(): Observable<Providers[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<Providers[]>(`${ENDPOINT}/Suppliers`, options);
  }

  getProviderById(id: string): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<Providers[]>(
      `${ENDPOINT}/Suppliers/GetById?id=${id}`,
      options
    );
  }

  saveProvider(provider: Providers): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/Suppliers`,
      provider,
      options
    );
  }

  updateProvider(provider: Providers): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/Suppliers`,
      provider,
      options
    );
  }

  getElementProvider(): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(`${ENDPOINT}/elementProvider`, options);
  }

  getElementProviderByProviderId(id: number): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<Providers[]>(
      `${ENDPOINT}/elementProvider/GetElementProviderByProviderId?providerId=${id}`,
      options
    );
  }

  getElementProviderById(id: number): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(
      `${ENDPOINT}/elementProvider/GetById?id=${id}`,
      options
    );
  }

  getelementProviderHistoricIncrementsByid(
    id: number
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/elementProvider/GetHistoricIncrementsById?id=${id}`,
      options
    );
  }

  saveIncrementElements(
    IncrementElements: IncrementElements[]
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/elementProvider/IncrementElements`,
      IncrementElements,
      options
    );
  }

  updateElementProviderIncrementElementsBacth(formData: any): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post(
      `${ENDPOINT}/elementProvider/IncrementElementsBacth`,
      formData,
      options
    );
  }

  notifyProvider(step: number) {
    this.stepChangeSubject.next(step);
  }

  notifyProviderId(id: number) {
    this.providerIdSource.next(id);
  }

  setProviderName(providerName: string): void {
    this.providerNameSubject.next(providerName);
  }

  getProviderName(): Observable<string> {
    return this.providerNameSubject.asObservable();
  }

  setElementName(elementName: string): void {
    this.elementNameSubject.next(elementName);
  }

  getPosition(): Observable<string> {
    return this.elementNameSubject.asObservable();
  }
}
