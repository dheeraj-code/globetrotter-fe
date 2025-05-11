import axios from 'axios';
import { authService } from './auth';
import { config } from '../config';

const API_URL = `${config.apiBaseUrl}${config.endpoints.quiz}`;

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
    const response = await quizAxios.post('/start');
    const sessionId = response.data?.id;
    if (!sessionId) {
      throw new Error('Invalid response format: missing sessionId');
    }
    return sessionId;
  },

  getRandomQuestion: async (sessionId) => {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }
    const questionData = (await quizAxios.get(`/random/${sessionId}`)).data;
    if (!questionData) {
      throw new Error('Invalid response format: missing question data');
    }
    return questionData;
  },

  submitAnswer: async (sessionId, quizQuestionId, userAnswerCityId, isCorrect) => {
    if (!sessionId || !quizQuestionId || userAnswerCityId === undefined) {
      throw new Error('Missing required parameters for submitting answer');
    }
    const submissionResult = (await quizAxios.post('/answer', {
      sessionId,
      quizQuestionId,
      userAnswerCityId,
      isCorrect
    })).data;
    if (!submissionResult) {
      throw new Error('Invalid response format: missing submission result');
    }
    return submissionResult;
  }
};

export default quizService; 