import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AddAreas, Areas } from '../models/areas';
import { environment } from 'src/environments/environment';
import { ResponseDto } from 'src/app/models/responseDto';
import { AuthService } from 'src/app/core/services/auth.service';
import { PermissionInsertModel } from '../models/permission_model';
import { MenuModel } from '../models/menus_model';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class AreasService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  private reloadPermissionAndMenusSubject = new Subject<Areas>();
  reloadPermissionAndMenus$ =
    this.reloadPermissionAndMenusSubject.asObservable();

  reloadPermissionAndMenus(data: Areas) {
    this.reloadPermissionAndMenusSubject.next(data);
  }

  getArea(): Observable<Areas[]> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<Areas[]>(`${ENDPOINT}/Areas`, options);
  }

  saveArea(areas: AddAreas): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<ResponseDto>(
      `${ENDPOINT}/Areas`,
      areas,
      options
    );
  }

  updateArea(areas: Areas): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/Areas`,
      areas,
      options
    );
  }

  getPermissionArea(idArea: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/api/Permission/GetAllPermissionByArea?idArea=${idArea}`,
      options
    );
  }

  updatePermissionArea(
    permission: PermissionInsertModel
  ): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/api/Permission`,
      permission,
      options
    );
  }

  getMenusArea(idArea: number): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.get<ResponseDto>(
      `${ENDPOINT}/api/AreaMenu/GetAllMenusByArea?idArea=${idArea}`,
      options
    );
  }

  updateMenuArea(menus: MenuModel): Observable<ResponseDto> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.put<ResponseDto>(
      `${ENDPOINT}/api/AreaMenu`,
      menus,
      options
    );
  }
}
