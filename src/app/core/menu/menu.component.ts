import { Component, Inject, OnInit } from '@angular/core';
import {
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';

import { environment } from 'src/environments/environment';
import { AreaMenu, ProfileType } from './models/menu';
import { AuthService } from '../services/auth.service';
import { Alert } from 'src/app/helpers/alert_helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenDto } from '../models/token-dto';
import { LoginDto } from '../models/login.model';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  private readonly authService: MsalService;
  profile: ProfileType = {
    displayName: '',
    id: '',
    mail: '',
  };
  opened: boolean = true;
  showSubmenu = false;
  menus: AreaMenu[];
  constructor(
    authService: MsalService,
    private spinner: NgxSpinnerService,
    private auth: AuthService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration
  ) {
    this.authService = authService;
  }

  async ngOnInit() {
    if (this.authService.instance.getAllAccounts().length > 0) {
      this.getProfile();
      await this.getGroup();
    }

    this.auth.menus$.subscribe((m) => {
      this.menus = m;
    });
  }

  open() {
    this.opened = !this.opened;
  }

  getProfile(): void {
    this.auth.getProfile().subscribe({
      next: (response: ProfileType) => {
        this.profile = response as ProfileType;
      },
      error: (error) => {
        Alert.errorHttp(error);
      },
    });
  }

  async getGroup() {
    try {
      this.spinner.show();
      const groupIds = await this.getInformationGroupProfile();
      console.log('Grupos asignados: ', groupIds);
      this.spinner.hide();
      await this.getToken(groupIds);
    } catch (error) {
      this.spinner.hide();
      Alert.errorHttp(error);
    }
  }

  getInformationGroupProfile(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.auth.getInformationGroupProfile().subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  async logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: environment.msalAuth.postLogoutRedirectUri,
    });
    this.auth.logout();
    this.clearStorageAndCookies();
  }

  clearStorageAndCookies() {
    localStorage.clear();

    // Limpiar cookies
    const cookies = document.cookie.split('; ');
    for (let c of cookies) {
      const cookieName = c.split('=')[0];
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }

  toggleSubmenu() {
    this.showSubmenu = !this.showSubmenu;
  }

  ///servicios backend
  getToken(groupIds: string[]) {
    this.spinner.show();

    let userName = '';
    if (!this.profile.displayName) {
      userName = this.profile.mail;
    } else {
      userName = this.profile.displayName;
    }

    const login: LoginDto = {
      groupsId: groupIds,
      userName: userName,
    };

    this.auth.loginPermissions(login).subscribe({
      next: (response: TokenDto) => {
        this.auth.isAuthenticated();
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        console.error(error);
        Alert.errorHttp(error).then((result) => {
          if (result.isConfirmed) {
            Alert.questionConfirm(
              '¿Desea reintentar obtener el token?',
              'Error de token - servidor'
            ).then((result) => {
              if (result.isConfirmed) {
                this.getGroup();
              } else {
                this.logout();
              }
            });
          }
        });
      },
    });
  }
}
