import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Elemento } from '../models/elementos';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseDto } from 'src/app/models/responseDto';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class ElementosService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getElemento(): Observable<Elemento[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<Elemento[]>(
      `${ENDPOINT}/elementProvider`,
      options
    );
  }

  saveElemento(elemento: Elemento): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/elementProvider`,
      elemento,
      options
    );
  }

  updateElemento(elemento: Elemento): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/elementProvider`,
      elemento,
      options
    );
  }

  getSupplier(): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<any>(`${ENDPOINT}/Suppliers`, options);
  }

  getElementByElementType(id: string): Observable<Elemento[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<Elemento[]>(
      `${ENDPOINT}/element/GetElementsByElementType?elementTypeId=${id}`,
      options
    );
  }

  // getElementCode(): Observable<Elemento>{
  //   return this._httpClient.get<Elemento>(`${ENDPOINT}/elementProvider/GetElementProviderByElementCode`);
  // }
}
