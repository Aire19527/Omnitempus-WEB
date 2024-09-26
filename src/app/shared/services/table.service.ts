import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getData(url: string): Observable<any[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this.http.get<any[]>(`${ENDPOINT}/${url}`, options);
  }

  deleteData(url: string, id: number): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };
    return this.http.delete<any>(`${ENDPOINT}/${url}?id=${id}`, options);
  }
}
