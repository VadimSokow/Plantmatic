import { LogLevel, PublicClientApplication } from '@azure/msal-browser'

// Config object to be passed to Msal on creation
export const msalConfig = {
  auth: {
    clientId: '3f165d44-ce8d-4a7d-974e-c05586e49628',
    authority:
      'https://plantauth.ciamlogin.com/f83be7dc-9d01-45cb-8c03-c841f2b10153/v2.0',
    redirectUri: '/auth/callback',
    postLogoutRedirectUri: '/',
    navigateToLoginRequestUrl: false,
    knownAuthorities: ['plantauth.ciamlogin.com'],
  },
  cache: {
    cacheLocation: 'localStorage',
  },
  system: {
    loggerOptions: {
      loggerCallback: (
        level: LogLevel,
        message: string,
        containsPii: boolean,
      ) => {
        if (containsPii) {
          return
        }
        switch (level) {
          case LogLevel.Error: {
            console.error(message)
            return
          }
          case LogLevel.Info: {
            console.info(message)
            return
          }
          case LogLevel.Verbose: {
            console.debug(message)
            return
          }
          case LogLevel.Warning: {
            console.warn(message)
            return
          }
          default: {
            return
          }
        }
      },
      logLevel: LogLevel.Verbose,
    },
  },
}

export const msalInstance = new PublicClientApplication(msalConfig)

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: ['User.Read'],
}

export const tokenRequest = {
  scopes: ['api://3cc05a01-b350-43ae-aa8e-9dd2ce3a28fd/API.use'],
}
