import { InteractionRequiredAuthError } from '@azure/msal-browser'
import axios from 'axios'
import { msalInstance, tokenRequest } from '../authConfig'

export const apiClient = axios.create({
  baseURL: 'https://plantfun.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  async config => {
    const response = await msalInstance.acquireTokenSilent({
      ...tokenRequest,
    }).catch(async error => {
      if (error instanceof InteractionRequiredAuthError) {
        await msalInstance.acquireTokenRedirect(tokenRequest)
      }
      throw error
    })
    if (response.accessToken) {
      config.headers.Authorization = `Bearer ${response.accessToken}`
    } else {
      console.error('No access token found')
      throw new Error('No access token found')
    }
    return config
  }, error => {
    return Promise.reject(error)
  },
)
