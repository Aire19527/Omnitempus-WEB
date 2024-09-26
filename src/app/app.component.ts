import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CargoComponent } from './feature/catalogos/cargos/components/cargo/cargo.component';
import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import { Subject, filter, takeUntil } from 'rxjs';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
  RedirectRequest,
} from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'proyecto-omnitempus-frontend';
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private matDialog: MatDialog,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private broadcastService: MsalBroadcastService,
    private authService: MsalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });

    this.broadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => {
          if (msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
            console.log('loguin correcto con token');
          }

          return msg.eventType === EventType.LOGIN_SUCCESS;
        }),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        this.setLoginDisplay();
        //this.checkAndSetActiveAccount();
      });

    // this.broadcastService.msalSubject$
    //   .pipe(
    //     filter(
    //       (msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS
    //     ),
    //     takeUntil(this._destroying$)
    //   )
    //   .subscribe((result: EventMessage) => {
    //     const payload = result.payload as AuthenticationResult;
    //     this.authService.instance.setActiveAccount(payload.account);
    //   });
  }

  openDialog() {
    this.matDialog.open(CargoComponent, {
      width: '350px',
    });
  }

  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
