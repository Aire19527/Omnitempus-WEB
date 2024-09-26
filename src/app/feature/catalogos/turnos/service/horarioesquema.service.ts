import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EsquemaEventService {
  private esquemaIdSource = new Subject<number>();
  private shiftIdSource = new Subject<number>();
  private generatedSchemasSource = new Subject<any[]>();
  private stepChangeSubject = new Subject<number>();
  private shiftSchemeNameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
 
  esquemaId$ = this.esquemaIdSource.asObservable();
  shiftId$ = this.shiftIdSource.asObservable();
  generatedSchemas$ = this.generatedSchemasSource.asObservable();
  stepChange$ = this.stepChangeSubject.asObservable();

  notifyEsquemaId(id: number) {
    this.esquemaIdSource.next(id);
  }

  notifyShiftId(id: number) {
    this.shiftIdSource.next(id);
  }

  notifyGeneratedSchemas(generatedSchemas: any[]) {
    this.generatedSchemasSource.next(generatedSchemas);
  }

  notifyStepChange(step: number) {
    this.stepChangeSubject.next(step);
  }

  setShiftSchemeName(shiftSchemeName: string): void {
    this.shiftSchemeNameSubject.next(shiftSchemeName);
  }

  getShiftSchemeName(): Observable<string> {
    return this.shiftSchemeNameSubject.asObservable();
  }

}
