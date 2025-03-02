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
      console.error('Error starting quiz session:', error.response?.data || error.message);
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
      console.error('Error getting random question:', error.response?.data || error.message);
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
      console.error('Error submitting answer:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default quizService; 