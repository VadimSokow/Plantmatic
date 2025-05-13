import {LogLevel, PublicClientApplication} from '@azure/msal-browser';

// Config object to be passed to Msal on creation
export const msalConfig = {
  auth: {
    clientId: 'eedbd612-f827-4bfc-bb2b-668615b9a8f6',
    authority: 'https://PlantmaticID.ciamlogin.com/ecb007b7-2fe6-4285-85da-a28ec3437880/v2.0',
    redirectUri: 'https://blue-pebble-05abc6003.6.azurestaticapps.net/',
    postLogoutRedirectUri: '/',
    navigateToLoginRequestUrl: false,
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
  scopes: ['api://05048acd-bf0d-46d1-9c77-1fa3c8c218a4/API.use'],
};
