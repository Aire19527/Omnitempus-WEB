import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SteppersService {
  private stepperChangeAreaSubject = new Subject<number>();
  stepperChangedArea$ = this.stepperChangeAreaSubject.asObservable();

  constructor() {}

  stepperChangedArea(index: number) {
    this.stepperChangeAreaSubject.next(index);
  }

  onStepperClicked() {
    return this.stepperChangeAreaSubject.asObservable();
  }
}
