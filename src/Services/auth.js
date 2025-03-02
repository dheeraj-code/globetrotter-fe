import Cookies from 'js-cookie';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create a new axios instance for auth service
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
      console.error('Login error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Failed to login. Please try again.');
    }
  },

  setToken(token) {
    try {
      // Validate token format
      if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
        throw new Error('Invalid token format');
      }

      Cookies.set('jwt_token', token, { 
        expires: 7,
        secure: import.meta.env.PROD,
        sameSite: 'Lax'
      });
    } catch (error) {
      console.error('Error setting token:', error);
      throw new Error('Failed to save authentication token');
    }
  },

  logout() {
    try {
      Cookies.remove('jwt_token');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always redirect to login page
      window.location.href = '/login';
    }
  },

  isAuthenticated() {
    try {
      const token = this.getToken();
      if (!token) return false;

      // Check if token is expired by checking its expiration date
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expirationTime) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      this.logout();
      return false;
    }
  },

  getToken() {
    try {
      return Cookies.get('jwt_token') || null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }
}; 