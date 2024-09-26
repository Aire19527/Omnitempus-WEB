import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { userLogin } from '../models/login-user';
import { Router } from '@angular/router';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }

  login(user: userLogin): Observable<userLogin> {
    return this.http.post<userLogin>(`${ENDPOINT}/account/Login`, user)
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
