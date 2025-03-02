import axios from 'axios';
import { authService } from './auth';

const API_URL = 'http://localhost:5000/quiz';

// Create a new axios instance for quiz service
const quizAxios = axios.create({
  baseURL: API_URL
});

// Add request interceptor to include auth token
quizAxios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (!token) {
      // If no token is found, redirect to login
      window.location.href = '/login';
      throw new Error('No authentication token found');
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
quizAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || 
        (error.response?.status === 400 && error.response?.data?.message === 'Invalid token.')) {
      // Token has expired or is invalid
      authService.logout();
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const quizService = {
  startQuizSession: async () => {
    try {
      const response = await quizAxios.post('/start');
      if (!response.data || !response.data.sessionId) {
        throw new Error('Invalid response format: missing sessionId');
      }
      return response.data.sessionId;
    } catch (error) {
      throw error;
    }
  },

  getRandomQuestion: async (sessionId) => {
    try {
      if (!sessionId) {
        throw new Error('Session ID is required');
      }
      const response = await quizAxios.get(`/random/${sessionId}`);
      if (!response.data) {
        throw new Error('Invalid response format: missing question data');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  submitAnswer: async (sessionId, quizQuestionId, userAnswerCityId) => {
    try {
      if (!sessionId || !quizQuestionId || userAnswerCityId === undefined) {
        throw new Error('Missing required parameters for submitting answer');
      }
      const response = await quizAxios.post('/submit', {
        sessionId,
        quizQuestionId,
        userAnswerCityId
      });
      if (!response.data) {
        throw new Error('Invalid response format: missing submission result');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default quizService; 