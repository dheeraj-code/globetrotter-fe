import Cookies from 'js-cookie';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const authAxios = axios.create({
  baseURL: API_URL
});

export const authService = {
  async login(email, password) {
    try {
      const response = await authAxios.post('/auth/login', {
        email,
        password
      });
      
      if (response.data.token) {
        this.setToken(response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to login. Please try again.');
    }
  },

  setToken(token) {
    try {
      if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
        throw new Error('Invalid token format');
      }

      Cookies.set('jwt_token', token, { 
        expires: 7,
        secure: import.meta.env.PROD,
        sameSite: 'Lax'
      });
    } catch (err) {
      throw new Error('Failed to save authentication token: ' + err);
    }
  },

  logout() {
    try {
      Cookies.remove('jwt_token');
    } catch (err) {
      throw new Error('Failed to remove authentication token: ' + err);
    }
  },

  isAuthenticated() {
    try {
      const token = this.getToken();
      if (!token) return false;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const now = Date.now();
      
      if (now >= expirationTime) {
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
      const token = Cookies.get('jwt_token');
      return token || null;
    } catch (err) {
      console.error('Error getting token:', err);
      return null;
    }
  }
}; 