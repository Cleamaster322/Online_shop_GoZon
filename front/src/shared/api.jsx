import axios from 'axios';
import { baseURL } from './config.jsx';

class ApiClient {
  constructor(baseUrl) {
    this.client = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    this.setCsrfToken();
    this.setTokenAuth();

    // перехват 401 с auto-refresh
    this.client.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        const isTokenExpired =
          error.response &&
          error.response.status === 401 &&
          error.response.data &&
          error.response.data.code === 'token_not_valid';

        if (isTokenExpired && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem('refreshToken');

          if (refreshToken) {
            try {
              const response = await axios.post(`${baseUrl}/api/token/refresh/`, {
                refresh: refreshToken,
              });

              const newAccessToken = response.data.access;
              localStorage.setItem('accessToken', newAccessToken);

              this.client.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

              return this.client(originalRequest);
            } catch (refreshError) {
              console.error('Refresh failed', refreshError);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/'; // принудительный выход
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async setCsrfToken() {
    try {
      const response = await this.client.get('/api/get_csrf_token/');
      if (response.data.csrfToken) {
        this.client.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
      }
    } catch (error) {
      console.log('Failed to get CSRF token', error);
    }
  }

  setTokenAuth() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }
}

const api = new ApiClient(baseURL);

export default api;
