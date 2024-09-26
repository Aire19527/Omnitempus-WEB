export const environment = {
  production: true,
  URlServerApi: 'https://82.223.20.88:83',

  msalAuth: {
    tenantId: '04fce6d2-a139-4217-99bd-ce0bc3c1e6af',
    clientId: '167f30db-40ba-4af4-a625-d1a3d1f10e29',
    authority:
      'https://login.microsoftonline.com/04fce6d2-a139-4217-99bd-ce0bc3c1e6af',
    redirectUri: 'https://82.223.20.88/catalogo',
    postLogoutRedirectUri: 'https://82.223.20.88',
    graphEndpoint: 'https://graph.microsoft.com/v1.0/me',
    graphGruposEndpoint:
      'https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.group?$count=true',
  },
};
