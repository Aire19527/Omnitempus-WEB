import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefrescarComponentesService {
  private refreschElementSubject = new Subject<boolean>();

  constructor() {}

  refreschElement$ = this.refreschElementSubject.asObservable();
  refreschElement() {
    this.refreschElementSubject.next(true);
  }
}
