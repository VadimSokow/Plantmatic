import {LogLevel, PublicClientApplication} from '@azure/msal-browser';

// Config object to be passed to Msal on creation
export const msalConfig = {
  auth: {
    clientId: 'b3763c91-c7c2-460e-b201-c20b7a2f1f4a',
    authority: 'https://PlantmaticID.ciamlogin.com/PlantmaticID.onmicrosoft.com/oauth2/v2.0/authorize?client_id=05048acd-bf0d-46d1-9c77-1fa3c8c218a4&nonce=KVjspJba6L&redirect_uri=https://plantfun.azurewebsites.net/.auth/login/aad/callback&scope=openid&response_type=id_token&prompt=login',
    redirectUri: '/', // Must be registered as a SPA redirectURI on your app registration
    postLogoutRedirectUri: '/' // Must be registered as a SPA redirectURI on your app registration
  },
  cache: {
    cacheLocation: 'localStorage'
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
      logLevel: LogLevel.Verbose
    }
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: ['User.Read'],
};

export const tokenRequest = {
  scopes: ['api://b3763c91-c7c2-460e-b201-c20b7a2f1f4a/PlantAPI'],
};
