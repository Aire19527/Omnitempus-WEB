import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService {
  constructor(private route: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string | null = localStorage.getItem('token');
    let request = req;
    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.route.navigate(['/inicio']);
        }

        return throwError(() => err);
      })
    );
  }
}
