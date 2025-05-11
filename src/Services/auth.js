import Cookies from 'js-cookie';
import axios from 'axios';
import { config } from '../config';

const API_URL = `${config.apiBaseUrl}${config.endpoints.auth}`;

const authAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': `${config.apiBaseUrl}`
  }
});

authAxios.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    if (error.response.status === 401) {
      authService.logout();
    }
    throw error;
  }
);

export const authService = {
  async login(email, password) {
    try {
      const response = await authAxios.post('/login', {
        email,
        password
      });

      console.log(response.data, response.data.token)
      
      if (response.data.token) {
        this.setToken(response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to login. Please try again.';
      throw new Error(message);
    }
  },

  async register(username, email, password) {
    try {
      const response = await authAxios.post('/register', {
        username,
        email,
        password
      });

      if (response.data.token) {
        this.setToken(response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register. Please try again.';
      throw new Error(message);
    }
  },

  setToken(token) {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token format');
      }

      Cookies.set('jwt_token', token, { 
        expires: 7,
        secure: "true",
        sameSite: 'Lax'
      });
    } catch (err) {
      console.log(err)
      throw new Error('Failed to save authentication token: ' + err.message);
    }
  },

  logout() {
    try {
      Cookies.remove('jwt_token');
    } catch (err) {
      console.error('Error during logout:', err);
      Cookies.remove('jwt_token');
    }
  },

  isAuthenticated() {
    try {
      const token = this.getToken();
      if (!token) return false;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const now = Date.now();
      
      if (now >= expirationTime - 300000) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error checking authentication:', err);
      this.logout();
      return false;
    }
  },

  getToken() {
    try {
      return Cookies.get('jwt_token') || null;
    } catch (err) {
      console.error('Error getting token:', err);
      return null;
    }
  }
}; 