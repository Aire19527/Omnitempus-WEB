import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddCliente, Cliente } from '../models/clientes';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  constructor(
    private _httpCliente: HttpClient,
    private authService: AuthService
  ) {}

  getCustomer(): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpCliente.get<any>(`${ENDPOINT}/Customers`, options);
  }

  saveCliente(cliente: AddCliente): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpCliente.post<Cliente>(
      `${ENDPOINT}/Customers`,
      cliente,
      options
    );
  }

  updateCliente(cliente: Cliente): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpCliente.put<any>(
      `${ENDPOINT}/Customers`,
      cliente,
      options
    );
  }

  getClienteById(id: string): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpCliente.get<any>(
      `${ENDPOINT}/Customers/GetById?id=${id}`,
      options
    );
  }
}
