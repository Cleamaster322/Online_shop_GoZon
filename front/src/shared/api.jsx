import axios from 'axios'
import { baseURL} from "./config.jsx";


class ApiClient {
  constructor(baseUrl) {
    this.client = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    this.setCsrfToken()
    this.setTokenAuth()

  }

  async setCsrfToken() {
    try {
      const response = await this.client.get('/api/get_csrf_token/')
      if (response.data.csrfToken) {
        this.client.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken
      }
    } catch (error) {
      console.log('Failed on get csrf', error)
    }
  }

  async setTokenAuth() {
    try {
      const token = localStorage.getItem('accessToken')
      if (token) {
        this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Error on auth set token', error)
    }
  }

  async get(url, config = {}) {
    return this.client.get(url, config)
  }
  async post(url, data = {}, config = {}) {
    if (!this.client.defaults.headers.common['X-CSRFToken']) {
      await this.setCsrfToken()
    }
    return this.client.post(url, data, config)
  }

}

const api = new ApiClient(baseURL)

export default api