import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (
  route,
  state
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  return inject(AuthService).isAuthenticated()
    ? true
    : inject(Router).createUrlTree(['/login']);
};
