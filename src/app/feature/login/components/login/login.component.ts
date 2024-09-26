import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { userLogin } from '../../models/login-user';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { environment } from 'src/environments/environment';
import { Subject, filter, takeUntil } from 'rxjs';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  constructor(
    private router: Router,
    private loginService: LoginService,
    private fb: FormBuilder,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private broadcastService: MsalBroadcastService,
    private authService: MsalService
  ) {
    this.setForm();
  }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        if (this.loginDisplay)
          this.router.navigate(['/inicio']);
      })

  }

  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect();
    } else {
      this.authService.loginRedirect();
    }
  }

  logout() { // Add log out function here
    this.authService.logoutPopup({
      postLogoutRedirectUri: environment.msalAuth.postLogoutRedirectUri
    });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  setForm(): void {
    this.formLogin = this.fb.group({
      email: '',
      password: '',
    });
  }


}
