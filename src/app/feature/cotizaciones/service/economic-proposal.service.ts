import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AddNote } from '../models/economicProposal';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

const ENDPOINT = environment.URlServerApi;

@Injectable({
  providedIn: 'root',
})
export class EconomicProposalService {
  constructor(
    private _httpClient: HttpClient,
    private authService: AuthService
  ) {}

  saveAddNote(AddNote: AddNote): Observable<any> {
    const userToken = `Bearer ${this.authService.readToken()}`;
    const headers = new HttpHeaders({ Authorization: userToken });
    const options = { headers: headers };

    return this._httpClient.post<any>(`${ENDPOINT}/addNote`, AddNote, options);
  }
}
