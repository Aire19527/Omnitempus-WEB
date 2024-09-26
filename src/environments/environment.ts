// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //URlServerApi: 'https://82.223.20.88:83',
  URlServerApi: 'https://localhost:5001',
  postLogoutUrl: 'http://localhost:4200',
  URlServerApiAd: 'http://localhost:4200/',
  source: 'localhost',

  msalAuth: {
    tenantId: '04fce6d2-a139-4217-99bd-ce0bc3c1e6af',
    clientId: '167f30db-40ba-4af4-a625-d1a3d1f10e29',
    authority:
      'https://login.microsoftonline.com/04fce6d2-a139-4217-99bd-ce0bc3c1e6af',
    redirectUri: 'http://localhost:4200/catalogo',
    postLogoutRedirectUri: 'http://localhost:4200/inicio',
    graphEndpoint: 'https://graph.microsoft.com/v1.0/me',
    graphGruposEndpoint:
      'https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.group?$count=true',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugin1
