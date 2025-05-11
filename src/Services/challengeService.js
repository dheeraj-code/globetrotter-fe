import axios from 'axios';
import { authService } from './auth';
import { config } from '../config';

const API_URL = `${config.apiBaseUrl}${config.endpoints.challenge}`;

// Create a new axios instance for challenge service
const challengeAxios = axios.create({
  baseURL: API_URL
});

// Add request interceptor to include auth token
challengeAxios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const challengeService = {
  createChallenge: async (quizSessionId) => {
    try {
      if (!quizSessionId) {
        throw new Error('Quiz session ID is required to create a challenge');
      }
      const response = await challengeAxios.post('/create', { sessionId: quizSessionId });
      
      if (!response.data || !response.data.inviteLink) {
        throw new Error('Invalid response from server when creating challenge');
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Challenge creation endpoint not found. Please check server configuration.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (!error.response) {
        throw new Error('Network error: Could not connect to the server');
      }
      throw error;
    }
  },

  getChallengeByLink: async (inviteLink) => {
    const response = await challengeAxios.get(`/${inviteLink}`);
    return response.data;
  },

  acceptChallenge: async (inviteLink) => {
    const response = await challengeAxios.post(`/${inviteLink}/accept`);
    return response.data;
  },

  getUserChallenges: async () => {
    const response = await challengeAxios.get('/user/challenges');
    return response.data;
  }
};

export default challengeService; 