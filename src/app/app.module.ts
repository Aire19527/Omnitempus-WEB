import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';

//extras
import { ToastrModule } from 'ngx-toastr';
import { DecimalPipe } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CoreModule } from './core/core.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { customMatPaginatorInit } from './shared/config/LibraryConfig';

import {
  MsalModule,
  MsalRedirectComponent,
  MsalGuard,
  MsalInterceptor,
} from '@azure/msal-angular'; // Import MsalInterceptor
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { PdfViewerModule } from 'ng2-pdf-viewer';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    DecimalPipe,
    NgxSpinnerModule.forRoot({ type: 'ball-spin-clockwise-fade' }),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      tapToDismiss: true,
      closeButton: true,
      newestOnTop: true,
      progressBar: true,
    }),
    CoreModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: environment.msalAuth.clientId,
          authority: environment.msalAuth.authority,
          redirectUri: environment.msalAuth.redirectUri,
          postLogoutRedirectUri: environment.msalAuth.postLogoutRedirectUri,
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: isIE,
        },
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['user.read'],
        },
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          [environment.msalAuth.graphEndpoint, ['user.read']],
        ]),
      }
    ),
    PdfViewerModule,
  ],
  providers: [
    DecimalPipe,
    { provide: MatPaginatorIntl, useValue: customMatPaginatorInit() },
    //{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    MsalGuard,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
