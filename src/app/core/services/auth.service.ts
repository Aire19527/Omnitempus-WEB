import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ResponseDto } from 'src/app/models/responseDto';
import { environment } from 'src/environments/environment';
import { TokenDto } from '../models/token-dto';
import { AzuremMyGroups } from '../models/azure-groups';
import { AreaMenu, ProfileType } from '../menu/models/menu';
import { LoginDto } from '../models/login.model';

const ENDPOINT = environment.URlServerApi;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private menusSubject = new BehaviorSubject<AreaMenu[]>([]);
  menus$ = this.menusSubject.asObservable();

  getProfile(): Observable<ProfileType> {
    return this.http.get<ProfileType>(environment.msalAuth.graphEndpoint);
  }

  getInformationGroupProfile(): Observable<string[]> {
    return this.http
      .get<AzuremMyGroups>(environment.msalAuth.graphGruposEndpoint)
      .pipe(
        map((resp) => {
          const res = resp.value;
          return res.map((a) => a.id);
        })
      );
  }

  loginPermissions(login: LoginDto): Observable<TokenDto> {
    return this.http
      .post<ResponseDto>(`${ENDPOINT}/api/Authenticate/ValidateArea`, login)
      .pipe(
        map((resp) => {
          const result = resp.result as TokenDto;
          this.saveToken(result.token, result.expiration);
          this.saveMenu(result.areaMenus);
          return result;
        })
      );
  }

  saveToken(token: string, expiresIn: number) {
    localStorage.setItem('token', token);
    let today = new Date();
    today.setSeconds(expiresIn);
    localStorage.setItem('expiresIn', today.getTime().toString());
  }

  saveMenu(menus: AreaMenu[]): void {
    localStorage.removeItem('menu_usuario');
    if (menus.length > 1) {
      localStorage.setItem('menu_usuario', JSON.stringify(menus));
      this.menusSubject.next(menus);
    }
  }

  getMenus(): AreaMenu[] {
    const menus = localStorage.getItem('menu_usuario');
    const menuParse = menus ? (JSON.parse(menus) as AreaMenu[]) : [];

    return menuParse;
  }

  readToken(): string {
    return localStorage.getItem('token') || '';
  }

  isAuthenticated(): boolean {
    let response: boolean = false;
    const token = this.readToken();
    if (token.length < 2) {
      response = false;
    } else {
      const expiraIn = Number(localStorage.getItem('expiresIn'));
      const todayExpira = new Date();

      todayExpira.setTime(expiraIn);
      if (todayExpira > new Date()) {
        response = true;
      }
    }
    return response;
  }

  logout() {
    if (this.readToken()) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiresIn');
      localStorage.removeItem('menu_usuario');
    }
  }

  decodeJWT(): any {
    const token = this.readToken();
    if (token) {
      const decodedToken = atob(token.split('.')[1]);
      const decodedObject = JSON.parse(decodedToken);
      return decodedObject;
    }
  }
}
