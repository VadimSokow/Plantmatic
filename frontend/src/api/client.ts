import axios from 'axios';
import { tokenRequest } from '../authConfig';
import { msalInstance } from '../authConfig';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

export const apiClient = axios.create({
  baseURL: 'https://plantfun.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => {
    const response = await msalInstance.acquireTokenSilent({
      ...tokenRequest,
    }).catch(async e => {
      if (e instanceof InteractionRequiredAuthError) {
        await msalInstance.acquireTokenRedirect(tokenRequest);
      }
      throw e;
    });
    if (response.accessToken) {
      config.headers.Authorization = `Bearer ${response.accessToken}`;
    } else {
      console.error('No access token found');
      return Promise.reject(new Error('No access token found'));
    }
    return config;
  }, error => {
    return Promise.reject(error);
  }
)

export const getDeviceId = async (input_id: string) => {
  const response = await apiClient.get(`/device/${input_id}`);
  return response.data;
}
